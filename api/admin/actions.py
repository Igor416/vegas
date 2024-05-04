from django.contrib import admin

@admin.action(description='Пометить как лучший')
def set_best(modeladmin, request, queryset):
  queryset.update(best=True)

@admin.action(description='Убрать пометку лучших')
def unset_best(modeladmin, request, queryset):
  queryset.update(best=False)

@admin.action(description='Убрать скидку')
def remove_discount(modeladmin, request, queryset):
  queryset.update(discount=0)