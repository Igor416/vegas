from django.contrib import admin
from api.models import Choice

@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
  list_filter = ('category',)
  ordering = ['name']
  exclude = ['category']