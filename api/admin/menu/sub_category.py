from django.contrib import admin
from api.models import MenuSubCategory
from .filter import MenuFilterInline

class ProductInline(admin.TabularInline):
  model = MenuSubCategory.products.through
  extra = 0

@admin.register(MenuSubCategory)
class MenuSubCategoryAdmin(admin.ModelAdmin):
  list_filter = ['menu_category']
  exclude= ['products']
  inlines = [ProductInline, MenuFilterInline]

class MenuSubCategoryInline(admin.TabularInline):
  model = MenuSubCategory
  extra = 0
  exclude = ['id', 'order', 'products']