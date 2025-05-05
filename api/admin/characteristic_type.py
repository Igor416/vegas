from django.contrib import admin
from api.models import CharacteristicType

@admin.register(CharacteristicType)
class CharacteristicTypeAdmin(admin.ModelAdmin):
  list_filter = ('category',)