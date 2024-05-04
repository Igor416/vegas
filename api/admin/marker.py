from django.contrib import admin
from api.models import Marker

@admin.register(Marker)
class MarkerAdmin(admin.ModelAdmin):
  pass