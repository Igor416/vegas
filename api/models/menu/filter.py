from django.db import models
from uuid import uuid4

from ..product import Product
from .sub_category import MenuSubCategory

class MenuFilter(models.Model):
  id = models.UUIDField('ID', primary_key=True, default=uuid4)

  value = models.CharField('Значение', max_length=32)
  menu_sub_category = models.ForeignKey(MenuSubCategory, on_delete=models.CASCADE, verbose_name='Подкатегория в меню', related_name='filters')
  products = models.ManyToManyField(Product, verbose_name='Товары', related_name='menu_filters', blank=True)
  name_en = models.CharField('Название (en)', max_length=64)
  name_ru = models.CharField('Название (ru)', max_length=64)
  name_ro = models.CharField('Название (ro)', max_length=64)
  order = models.SmallIntegerField('Порядок')
  
  def __str__(self):
    return f'{self.name_ru} в подкатегории: {self.menu_sub_category.name_ru}, в категори: {self.menu_sub_category.menu_category}'
  
  class Meta:
    ordering = ['menu_sub_category__menu_category__order', 'menu_sub_category__order', 'order']
    verbose_name = 'Фильтр меню'
    verbose_name_plural = 'Фильтры меню'
  