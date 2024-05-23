from django.contrib import admin
from stock.models import Action, Stockable
from .action import ActionInline

@admin.register(Stockable)
class StockableAdmin(admin.ModelAdmin):
  search_fields = ('product', 'width', 'length')
  list_filter = ('table', 'category', 'product')
  inlines = (ActionInline,)