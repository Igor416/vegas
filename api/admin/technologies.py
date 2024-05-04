from django.contrib import admin
from api.models import Technology, LayerMattress, LayerPillow, LayerMattressPad

@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
  ordering = ['name_ru']

class LayerMattressInline(admin.TabularInline):
  model = LayerMattress
  extra = 3

class LayerPillowInline(admin.TabularInline):
  model = LayerPillow
  extra = 3

class LayerMattressPadInline(admin.TabularInline):
  model = LayerMattressPad
  extra = 3