from django.contrib import admin

from api.models import Technology


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    ordering = ("name_ru",)
    list_filter = ("is_technology",)
