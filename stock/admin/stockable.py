from django.contrib import admin
from stock.models import Action, Stockable
from .action import ActionInline, set_as_ordered, set_as_saling, set_as_sold, set_as_returned

class StockableListFilter(admin.SimpleListFilter):
  title = 'По размерам'
  parameter_name = 'size'

  def lookups(self, request, model_admin):
    return list(set([(stockable.product + ':' + stockable.size, stockable.print_size()) for stockable in model_admin.model.objects.all()]))

  def queryset(self, request, queryset):
    if self.value():
      return queryset.filter(product=self.value().split(':')[0], size=self.value().split(':')[1])

@admin.register(Stockable)
class StockableAdmin(admin.ModelAdmin):
  exclude = ('table',)
  search_fields = ('product', 'size')
  list_filter = (StockableListFilter,)
  inlines = (ActionInline,)
  actions = (set_as_ordered, set_as_saling, set_as_sold, set_as_returned)
  
  def get_queryset(self, request):
    qs = super().get_queryset(request)
    if request.user.is_superuser:
      return qs
    for entry in qs.all():
      if entry.current_state == 'S':
        qs = qs.exclude(pk=entry.pk)
    return qs
  
  def save_model(self, request, obj, form, change):
    print(obj)
    return
    super().save_model(request, obj, form, change)
    if len(obj.actions.all()) == 0:
      obj.actions.add(Action.objects.create(type=type, person=request.user.username, place='CA', entry=obj))
    obj.actions.filter(person='').update(person=request.user.username)