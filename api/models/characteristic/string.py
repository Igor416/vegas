from django.db import models
from ..characteristic_type import CharacteristicType
from .characteristic import Characteristic

class StringCharacteristic(Characteristic):
	value_en = models.CharField('Значение (en)', max_length=64)
	value_ru = models.CharField('Значение (ru)', max_length=64)
	value_ro = models.CharField('Значение (ro)', max_length=64)
 
	type = models.ForeignKey(CharacteristicType, on_delete=models.CASCADE, verbose_name='Тип', related_name='string_characteristics')
	product = models.ForeignKey('Product', on_delete=models.CASCADE, verbose_name='Товар', related_name='string_characteristics')

	def __str__(self):
		return f'{self.type}: "{self.value_ru}"'
		
	class Meta:
		verbose_name = 'Характиристика (строка)'
		verbose_name_plural = 'Характеристики (строки)'