from django.contrib import admin
from stock.models import Action, Stockable

class ActionInline(admin.TabularInline):
  exclude = ('person',)
  model = Action
  extra = 0

@admin.register(Stockable)
class StockableAdmin(admin.ModelAdmin):
  search_fields = ('product', 'width', 'length')
  list_filter = ('table', 'category', 'product')
  inlines = (ActionInline,)