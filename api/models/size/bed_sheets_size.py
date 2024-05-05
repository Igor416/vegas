from django.db import models
from .size import Size

class BedSheetsSize(Size):
  duvet_cover_size = models.CharField('Размер Пододеяльника', max_length=7)
  sheet_size = models.CharField('Простыня', max_length=7)
  elasticated_sheet_size = models.CharField('Простыня на резинке', max_length=7)
  pillowcase_sizes = models.CharField('Наволочки', max_length=11)

  class Meta:
    verbose_name = 'размер постельного белья'
    verbose_name_plural = 'размеры постельного белья'