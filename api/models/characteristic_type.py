from django.db import models
from .category import Category
from uuid import uuid4

class CharacteristicType(models.Model):
	DATA_TYPES = {
		'B': 'булеан',
		'I': 'целое число',
		'S': 'строка'
	}
  
	id = models.UUIDField('ID', primary_key=True, default=uuid4)
 
	name = models.CharField('Характеристика', max_length=32)
	label_en = models.CharField('Название (en)', max_length=32)
	label_ru = models.CharField('Название (ru)', max_length=32)
	label_ro = models.CharField('Название (ro)', max_length=32)
	category = models.ForeignKey(Category, related_name='characteristic_types', on_delete=models.CASCADE, verbose_name='Категория')
	data_type = models.CharField('Тип данных', choices=DATA_TYPES, max_length=1)
	in_description = models.BooleanField('Присуствует в описании', default=False)
	order = models.SmallIntegerField('Порядок', default=0)

	def __str__(self):
		return f'Вариант выбора для "{self.label_ru}" в категории {self.category}'
		
	class Meta:
		ordering = ['category', 'order']
		verbose_name = 'Тип характеристики'
		verbose_name_plural = 'Типы характеристик'