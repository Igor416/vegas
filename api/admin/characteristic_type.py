from django.contrib import admin
from api.models import CharacteristicType

@admin.register(CharacteristicType)
class CharacteristicTypeAdmin(admin.ModelAdmin):
  list_filter = ('category',)
  search_fields = ['name', 'label_ru']
  
class CharacteristicTypeInline(admin.TabularInline):
  model = CharacteristicType
  extra = 0
  exclude = ['id']