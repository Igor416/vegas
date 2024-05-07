from django.contrib import admin
from api.models import Action

class ActionInline(admin.TabularInline):
  exclude = ('person',)
  model = Action
  extra = 1

def create_actions(type, request, queryset):
  for entry in queryset:
    entry.actions.add(Action.objects.create(type=type, person=request, place=entry.current_place, entry=entry))
  
@admin.action(description='Пометить как бронь')
def set_as_ordered(modeladmin, request, queryset):
  create_actions('O', request, queryset)

@admin.action(description='Отменить бронь')
def set_as_saling(modeladmin, request, queryset):
  create_actions('C', request, queryset)

@admin.action(description='Отметить как проданный')
def set_as_sold(modeladmin, request, queryset):
  create_actions('S', request, queryset)

@admin.action(description='Получить возврат')
def set_as_returned(modeladmin, request, queryset):
  create_actions('R', request, queryset)