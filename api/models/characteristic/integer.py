from django.db import models
from ..characteristic_type import CharacteristicType
from .characteristic import Characteristic

class IntegerCharacteristic(Characteristic):
	value = models.IntegerField('Значение')
	type = models.ForeignKey(CharacteristicType, on_delete=models.CASCADE, verbose_name='Тип', related_name='integer_characteristics')
	product = models.ForeignKey('Product', on_delete=models.CASCADE, verbose_name='Товар', related_name='integer_characteristics')

	def __str__(self):
		return f'{self.type}: "{self.value}"'
		
	class Meta:
		verbose_name = 'Характиристика (целое число)'
		verbose_name_plural = 'Характеристики (целые числа)'