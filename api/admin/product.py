from django.contrib import admin
from api.models import Product
from .actions import set_best, unset_best, remove_discount
from .size import SizeInline
from .file import ImageInline, VideoInline
from .characteristic import StringCharacteristicInline, IntegerCharacteristicInline, BooleanCharacteristicInline

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
  actions = [set_best, unset_best, remove_discount]
  list_filter = ['category']
  inlines = [SizeInline, ImageInline, VideoInline, StringCharacteristicInline, IntegerCharacteristicInline, BooleanCharacteristicInline]