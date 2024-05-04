from django.db import models
from django.utils.functional import cached_property
from .product import Product
from .supplies import create_related_field
from api.models.size import BedSheetsSize
from api.models.products.managers import BedSheetsManager

class BedSheets(Product):
  name = None
  name_en = models.CharField('Название (en)', max_length=32)
  name_ru = models.CharField('Название (ru)', max_length=32)
  name_ro = models.CharField('Название (ro)', max_length=32)
  
  sizes = models.ManyToManyField(BedSheetsSize, related_name='sizes%(class)s', verbose_name='Размеры')
  
  bedsheets_type = create_related_field('bedsheets_type', False, True)
  bedsheets_color = create_related_field('bedsheets_color')
  tissue = create_related_field('tissue')
  
  objects = BedSheetsManager()

  @cached_property
  def name(self):
    return self.name_en

  def __str__(self):
    return f'{self._meta.verbose_name}: {self.name_ru}, {self.bedsheets_color.property_ru}'

  def save(self, *args, **kwargs):
    super().save(*args, **kwargs)
    if self.category:
      for size in self.sizes.all():
        size.set_category_and_product(self.name_ru, self.category)
      super().save(*args, **kwargs)