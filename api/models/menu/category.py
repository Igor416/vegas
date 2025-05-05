from django.db import models
from uuid import uuid4
from ..size import Size

class MenuCategory(models.Model):
  id = models.UUIDField('ID', primary_key=True, default=uuid4)

  image = models.ImageField('Иконка', upload_to='menu_categories')
  name_en = models.CharField('Название (en)', max_length=16)
  name_ru = models.CharField('Название (ru)', max_length=16)
  name_ro = models.CharField('Название (ro)', max_length=16)
  sizes = models.ManyToManyField(Size, verbose_name='Хиты продаж', related_name='menu_categories')
  
  order = models.SmallIntegerField('Порядок')
  
  def __str__(self):
    return self.name_ru
  
  class Meta:
    ordering = ['order']
    verbose_name = 'Категория меню'
    verbose_name_plural = 'Категории меню'