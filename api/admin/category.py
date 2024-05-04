from django.contrib import admin
from api.models import Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
  fields = ['name', 'desc_en', 'desc_ru', 'desc_ro']