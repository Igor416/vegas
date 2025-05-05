from django.db import models
from .size import Size
from uuid import uuid4

class BedSheetsSizeAddition(models.Model):
  id = models.UUIDField('ID', primary_key=True, default=uuid4)
  
  size = models.OneToOneField(Size, on_delete=models.CASCADE, related_name='additions', verbose_name='Размер')
  duvet_cover_size = models.CharField('Размер Пододеяльника', max_length=7)
  sheet_size = models.CharField('Простыня', max_length=7)
  elasticated_sheet_size = models.CharField('Простыня на резинке', max_length=7)
  pillowcase_sizes = models.CharField('Наволочки', max_length=11)

  def __str__(self):
    return f'{self.size}'

  class Meta:
    ordering = ['size']
    verbose_name = 'Дополнение размера постельного белья'
    verbose_name_plural = 'Дополнения размеров постельного белья'