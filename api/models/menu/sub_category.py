from django.db import models
from uuid import uuid4

from ..category import Category
from ..product import Product
from .category import MenuCategory

class MenuSubCategory(models.Model):
  id = models.UUIDField('ID', primary_key=True, default=uuid4)

  value = models.CharField('Значение', max_length=32)
  menu_category = models.ForeignKey(MenuCategory, on_delete=models.CASCADE, verbose_name='Категория в меню', related_name='sub_categories')
  category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='Категория товаров', related_name='menu_sub_categories')
  products = models.ManyToManyField(Product, verbose_name='Товары', related_name='menu_sub_categories', blank=True)
  name_en = models.CharField('Название (en)', max_length=64)
  name_ru = models.CharField('Название (ru)', max_length=64)
  name_ro = models.CharField('Название (ro)', max_length=64)
  order = models.SmallIntegerField('Порядок')
  
  def __str__(self):
    return f'{self.name_ru} в категории: {self.menu_category}'
  
  class Meta:
    ordering = ['menu_category__order', 'order']
    verbose_name = 'Подкатегория меню'
    verbose_name_plural = 'Подкатегории меню'
  