from django.contrib import admin
from api.models import Product
from .actions import set_best, unset_best, remove_discount
from .size import SizeInline
from .technology import LayerInline
from .file import ImageInline, VideoInline
from .characteristic import StringCharacteristicInline, IntegerCharacteristicInline, BooleanCharacteristicInline

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
  actions = [set_best, unset_best, remove_discount]
  list_filter = ['category']
  exclude = ['structure', 'technologies']
  inlines = [SizeInline, LayerInline, ImageInline, VideoInline, StringCharacteristicInline, IntegerCharacteristicInline, BooleanCharacteristicInline]