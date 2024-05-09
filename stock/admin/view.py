from django.contrib.auth.mixins import PermissionRequiredMixin
from django.views.generic.detail import DetailView
from django.contrib import admin
from stock.models import Action, Table
from calendar import monthrange
from django.utils.timezone import datetime

class TableDetailView(PermissionRequiredMixin, DetailView):
  permission_required = 'stock.view_table'
  template_name = 'admin/stock/table/detail.html'
  model = Table
  
  def get_context_data(self, **kwargs):
    obj = kwargs.get('object')
    get_id = lambda x: x.product + ':' + x.size
    object_dict = dict()
    for entry in obj.stockables.all():
      if str(get_id(entry)) not in object_dict:
        data = {
          'product': entry.product,
          'size': entry.size,
          'places': {place[1]: 0 for place in Action.PLACES},
          'sold': [0 for _ in range(monthrange(datetime.today().year, datetime.today().month)[1] - 1)],
          'total': '0'
        }
      else:
        data = object_dict[str(get_id(entry))]
      
      if entry.current_state == 'S':
        if entry.last_update.month == datetime.today().month - 1:
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
      **super().get_context_data(**kwargs),
      **admin.site.each_context(self.request),
      'object_list': object_dict.values(),
      'opts': self.model._meta,
    }