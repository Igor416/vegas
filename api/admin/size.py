from django.contrib import admin
from api.models import Size, BedSheetsSize
from api.forms import BedSheetsSizeForm

@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
  list_filter = ('category', 'product', 'on_sale')
  exclude = ['category', 'product']
  ordering = ['on_sale', 'category', 'product', 'length', 'priceEUR']
  
@admin.register(BedSheetsSize)
class BedSheetsSizeAdmin(admin.ModelAdmin):
  form = BedSheetsSizeForm
  exclude = ['category', 'product']
  ordering = ['category', 'product', 'length', 'priceEUR']