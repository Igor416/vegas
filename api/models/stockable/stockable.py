from django.db import models
from django.utils.functional import cached_property
from .table import Table

class Stockable(models.Model):
  product = models.CharField('Модель', max_length=32)
  size = models.CharField('Размер', max_length=7)
  table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='stockables')

  def print_size(self):
    return f'Размер продукта {self.product}: {self.size}'

  def __str__(self):
    if self.pk and self.last_action:
      return f'{self.print_size()}, последнее действие: {self.last_action.get_type_display()}, сейчас в месте: {self.current_place}'
    return f'Размер продукта {self.product}: {self.size}'

  @cached_property
  def last_action(self):
    return self.actions.reverse().first()
  
  @cached_property
  def current_place(self):
    return self.last_action.get_place_display()

  @cached_property
  def current_state(self):
    return self.last_action.type
  
  @cached_property
  def last_update(self):
    return self.last_action.date

  class Meta:
    verbose_name = 'модель'
    verbose_name_plural = 'модели'