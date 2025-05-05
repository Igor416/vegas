from django.db import models
from uuid import uuid4
from .category import Category
from .technology import Technology

class Product(models.Model):
  id = models.UUIDField('ID', primary_key=True, default=uuid4)
  name_en = models.CharField('Название (en)', max_length=32)
  name_ru = models.CharField('Название (ru)', max_length=32)
  name_ro = models.CharField('Название (ro)', max_length=32)
  desc_en = models.TextField('Описание (en)')
  desc_ru = models.TextField('Описание (ru)')
  desc_ro = models.TextField('Описание (ro)')
  discount = models.SmallIntegerField('Скидка (%)', default=0)
  best = models.BooleanField('Лидер продаж', default=False)
  markers = models.TextField('Маркеры', default='', blank=True)

  structure = models.ManyToManyField(Technology, related_name='structure_%(class)s', verbose_name='Структура', blank=True)
  technologies = models.ManyToManyField(Technology, related_name='technologies_%(class)s', verbose_name='Технологии', blank=True)

  category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='Категория')
  
  @property
  def shortcut(self):
    return self.images.filter(is_shortcut=True).first()

  @property
  def cheapest_size(self):
    return self.sizes.first()

  def __str__(self):
    return f'{self.name_ru} в категории: {self.category.name_s_ru}'

  @staticmethod
  def has_multiple_rels(model, field):
    if field == 'rigidity':
      return False
    return hasattr(getattr(model, field), 'rel')

  class Meta:
    ordering = ['category', 'name_en']
    verbose_name = 'Товары'
    verbose_name_plural = 'Товары'