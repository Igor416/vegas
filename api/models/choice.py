from django.db import models
from api import catalog as ct
from .category import Category

class Choice(models.Model):
	choices = ct.get_prop_choices()

	name = models.CharField('Характеристика', choices=choices, max_length=32)
	category = models.ManyToManyField(Category, related_name='categoryC')
	property_en = models.CharField('Вариант выбора (en)', max_length=64, blank=True)
	property_ru = models.CharField('Вариант выбора (ru)', max_length=64)
	property_ro = models.CharField('Вариант выбора (ro)', max_length=64, blank=True)

	def __str__(self):
		lst = list(map(lambda ctg: str(ctg), self.category.all()))
		s = ', '.join(lst)
		return f'Вариант выбора для "{ct.get_prop_trans(self.name)}" в категори{"и" if len(lst) == 1 else "ях"} "{s}": "{self.property_ru}"'

	def save(self, *args, **kwargs):
		for category in ct.get_categories(self.name):
			self.category.add(Category.objects.get(name=category))
		super().save(*args, **kwargs)
		

	class Meta:
		verbose_name = 'вариант выбора'
		verbose_name_plural = 'варианты выбора'