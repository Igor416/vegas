from django.db import models
from django.utils.functional import cached_property
from .table import Table

class Stockable(models.Model):
  CATEGORIES = (
    ('MSP', 'Матрасы Special'),
    ('MSM', 'Матрасы Smart'),
    ('MAL', 'Матрасы Alba'),
    ('MVK', 'Матрасы Vegas Kids'),
    ('MAC', 'Матрасы Active'),
    ('MEC', 'Матрасы Ecolatex'),
    ('MEX', 'Матрасы Exclusive'),
    ('MMO', 'Матрасы Modern'),
    ('MCO', 'Матрасы Comfort'),
    ('PI', 'Подушки'),
    ('MPP', 'Наматрасники Protect'),
    ('MPT', 'Наматрасники Transform'),
    ('BL', 'Одеяла'),
    ('BE', 'Кровати')
  )
  
  category = models.CharField('Категория', max_length=3, choices=CATEGORIES)
  product = models.CharField('Модель', max_length=32)
  width = models.SmallIntegerField('Ширина', default=0)
  length = models.SmallIntegerField('Длина', default=0)
  table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='stockables', verbose_name='Таблица')

  def print_size(self):
    return f'Размер продукта {self.product}: {self.size}'

  def __str__(self):
    if self.pk and self.last_action:
      return f'{self.print_size()}, последнее действие: {self.last_action.get_type_display()}, сейчас в месте: {self.last_action.get_place_display()}'
    return f'Размер продукта {self.product}: {self.size}'

  @cached_property
  def size(self):
    return f'{self.width}x{self.length}'

  @cached_property
  def last_action(self):
    return self.actions.reverse().first()
  
  @cached_property
  def current_place(self):
    return self.last_action.place

  @cached_property
  def current_state(self):
    return self.last_action.type
  
  @cached_property
  def last_update(self):
    return self.last_action.date

  class Meta:
    ordering = ['category', 'product', 'width', 'length']
    verbose_name = 'модель'
    verbose_name_plural = 'модели'