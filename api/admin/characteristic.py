from django.contrib import admin
from api.models import StringCharacteristic, IntegerCharacteristic, BooleanCharacteristic

class CharacteristicAdmin(admin.ModelAdmin):
  list_filter = ('type__category',)
  ordering = ['type']

@admin.register(StringCharacteristic)
class StringCharacteristicAdmin(CharacteristicAdmin):
  pass

@admin.register(IntegerCharacteristic)
class IntegerCharacteristicAdmin(CharacteristicAdmin):
  pass

@admin.register(BooleanCharacteristic)
class BooleanCharacteristicAdmin(CharacteristicAdmin):
  pass

class StringCharacteristicInline(admin.TabularInline):
  model = StringCharacteristic
  extra = 0
  exclude = ['id']
  ordering = ['value_ru']
  autocomplete_fields = ['type']

class IntegerCharacteristicInline(admin.TabularInline):
  model = IntegerCharacteristic
  extra = 0
  exclude = ['id']
  ordering = ['value']
  autocomplete_fields = ['type']
  
class BooleanCharacteristicInline(admin.TabularInline):
  model = BooleanCharacteristic
  extra = 0
  exclude = ['id']
  ordering = ['value']
  autocomplete_fields = ['type']