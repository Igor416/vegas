from django.contrib import admin
from api.models import MenuFilter

class ProductInline(admin.TabularInline):
  model = MenuFilter.products.through
  extra = 0

@admin.register(MenuFilter)
class MenuFilterAdmin(admin.ModelAdmin):
  list_filter = ['menu_sub_category__menu_category', 'menu_sub_category']
  exclude= ['products']
  inlines = [ProductInline]
    
class MenuFilterInline(admin.TabularInline):
  model = MenuFilter
  extra = 0
  exclude = ['id', 'order', 'products']