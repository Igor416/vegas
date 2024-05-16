from django.contrib import admin
from stock.models import Action

class ActionInline(admin.TabularInline):
  exclude = ('person',)
  model = Action
  extra = 1