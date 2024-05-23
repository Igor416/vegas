from django.contrib.auth.mixins import PermissionRequiredMixin
from django.http import HttpResponseRedirect
from django.views.generic.detail import DetailView
from django.views.generic.edit import UpdateView
from django.contrib import admin
from calendar import monthrange
from django.utils.timezone import datetime
from stock.models import Action, Stockable, Table
from stock.admin.form import TableForm

class TableDetailView(PermissionRequiredMixin, DetailView, UpdateView):
  fields = '__all__'
  permission_required = 'stock.view_table'
  template_name = 'admin/stock/table/detail.html'
  model = Table
  
  def get(self, request, *args, **kwargs):
    self.object = self.get_object()
    context = self.get_context_data(object=self.object, request=request, *args, **kwargs)
    return self.render_to_response(context)
  
  def get_context_data(self, *args, **kwargs):
    obj = kwargs.get('object')
    category = kwargs.get('category')
    get_id = lambda x: x.product + ':' + x.size
    object_dict = dict()
    for entry in obj.stockables.filter(category=category):
      if str(get_id(entry)) not in object_dict:
        data = {
          'product': entry.product,
          'size': entry.size,
          'places': {place[0]: 0 for place in Action.PLACES},
          'sold': [0 for _ in range(monthrange(datetime.today().year, datetime.today().month)[1])],
          'total': '0'
        }
      else:
        data = object_dict[str(get_id(entry))]
      
      if entry.current_state == 'S':
        if entry.last_update.month == datetime.today().month:
          data['sold'][entry.last_update.day - 1] += 1
      else:
        data['places'][entry.current_place] += 1
        total = data['total']
        if entry.current_state == 'O':
          data['total'] = total + '+1' if '+' not in total else total.split('+')[0] + '+' + str(int(total.split('+')[1]) + 1)
        else:
          data['total'] = str(int(total) + 1) if '+' not in total else str(int(total.split('+')[0]) + 1) + '+' + total.split('+')[1]
      
      object_dict[str(get_id(entry))] = data
      
    return {
      **super().get_context_data(*args, **kwargs),
      **admin.site.each_context(self.request),
      'table_id': obj.id,
      'category': category,
      'object_list': object_dict.values(),
      'is_admin': kwargs.get('request').user.groups.first().name != 'Консультант',
      'opts': self.model._meta,
    }
    
  def post(self, request, *args, **kwargs):
    create_action = lambda type, stockable: Action.objects.create(
      type=type,
      person=request.user.username,
      place=stockables[i].current_place,
      stockable=stockable
    )
    table = Table.objects.get(pk=kwargs.get('pk'))
    category = kwargs.get('category')
    form = TableForm(request.POST)
    print(form, form.data)
    if form.is_valid():
      product, size, value, prev, place = form.cleaned_data.values()
      width, length = list(map(int, size.split('x')))
      stockables = Stockable.objects.filter(category=category, product=product, width=width, length=length, table=table)
      i = 0
      if place == 'add':
        stockable = Stockable.objects.create(category=category, product=product, width=width, length=length, table=table)
        stockable.actions.add(Action.objects.create(type='A', person=request.user.username, place='S1', date=datetime.today(), stockable=stockable))
      elif place == 'delete':
        while stockables[i].current_place != 'Машина':
          i+=1
        stockables[i].delete()
      elif prev != place:
        value_s, value_o = map(int, map(lambda x: x.strip(), value.split('+'))) if '+' in value else (int(value.strip() if value != '' else 0), 0)
        prev_s, prev_o = map(int, map(lambda x: x.strip(), prev.split('+'))) if '+' in prev else (int(prev.strip() if prev != '' else 0), 0)
        
        if place == 'total':
          if value_o > prev_o:
            for _ in range(value_o - prev_o):
              while stockables[i].current_state in ['O', 'S']:
                i+=1
              stockables[i].actions.add(create_action('O', stockables[i]))
              i+=1
          else:
            for _ in range(prev_o - value_o):
              while stockables[i].current_state != 'O':
                i+=1
              stockables[i].actions.add(create_action('C', stockables[i]))
              i+=1
        else:
          if value_s < prev_s:
            for _ in range(prev_s - value_s):
              is_place = place in [place[0] for place in Action.PLACES]
              cond = lambda s: (s.current_place != place if is_place else s.last_update.day != int(place))
              while stockables[i].current_state != 'S' and cond(stockables[i]):
                i+=1
              stockables[i].actions.add(create_action('H' if is_place else 'R', stockables[i]))
              i+=1
          else:
            for _ in range(value_s - prev_s):
              while stockables[i].current_state != 'H':
                i+=1
              a = Action.objects.filter(type='H', stockable=stockables[i])
              if place in [place[0] for place in Action.PLACES]:
                a.update(place=place, type='T')
              else:
                a.update(type='S', date=datetime(table.year, table.month, int(place)))
              i+=1
    return HttpResponseRedirect(f'/admin/stock/table/{table.id}/{category}/detail')