from django.contrib import admin
from stock.models import Action, Stockable
from .action import ActionInline

@admin.register(Stockable)
class StockableAdmin(admin.ModelAdmin):
  search_fields = ('product', 'size')
  list_filter = ('table', 'product', 'size')
  inlines = (ActionInline,)
  
  def get_queryset(self, request):
    qs = super().get_queryset(request)
    if request.user.is_superuser:
      return qs
    for entry in qs.all():
      if entry.current_state == 'S':
        qs = qs.exclude(pk=entry.pk)
    return qs
  
  def save_model(self, request, obj, form, change):
    super().save_model(request, obj, form, change)
    if len(obj.actions.all()) == 0:
      obj.actions.add(Action.objects.create(type=type, person=request.user.username, place='CA', entry=obj))
    obj.actions.filter(person='').update(person=request.user.username)