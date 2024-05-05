from django.contrib import admin
from api.models import Stockable, Action

class ActionInline(admin.TabularInline):
  exclude = ('person',)
  model = Action
  extra = 1

@admin.register(Stockable)
class StockableAdmin(admin.ModelAdmin):
  inlines = (ActionInline,)