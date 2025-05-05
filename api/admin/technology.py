from django.contrib import admin
from api.models import Technology, Product

@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
  ordering = ['name_ru']

class LayerInline(admin.TabularInline):
  model = Product.structure.through
  extra = 0