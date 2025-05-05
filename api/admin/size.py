from django.contrib import admin

from api.models import Size

@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
  list_filter = ['product__category', 'product', 'on_sale']

class SizeInline(admin.TabularInline):
  model = Size
  extra = 0