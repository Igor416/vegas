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