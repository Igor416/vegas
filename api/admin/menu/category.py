from django.contrib import admin
from api.models import MenuCategory

from .sub_category import MenuSubCategoryInline

@admin.register(MenuCategory)
class MenuCategoryAdmin(admin.ModelAdmin):
  inlines = [MenuSubCategoryInline]