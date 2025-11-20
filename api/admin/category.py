from django.contrib import admin
from api.models import Category
from .characteristic_type import CharacteristicTypeInline

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
  inlines = [CharacteristicTypeInline]