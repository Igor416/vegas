from django.db import models
from ..characteristic_type import CharacteristicType
from .characteristic import Characteristic

class BooleanCharacteristic(Characteristic):
	value = models.BooleanField('Значение')
 
	type = models.ForeignKey(CharacteristicType, on_delete=models.CASCADE, verbose_name='Тип', related_name='boolean_characteristics')
	product = models.ForeignKey('Product', on_delete=models.CASCADE, verbose_name='Товар', related_name='boolean_characteristics')

	def __str__(self):
		return f'{self.type}: "{self.value}"'
		
	class Meta:
		verbose_name = 'Характиристика (булеан)'
		verbose_name_plural = 'Характеристики (булеан)'