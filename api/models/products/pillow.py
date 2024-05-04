from django.db import models
from .product import Product
from .supplies import create_related_field
from api.models.technologies import Technology, LayerPillow
from api.models.products.managers import PillowManager

class Pillow(Product):
  height = models.IntegerField(default=0)
  case = models.BooleanField(default=True)

  structure = models.ManyToManyField(Technology, through=LayerPillow, through_fields=('product', 'technology'), related_name='structure_%(class)s', verbose_name='Структура', blank=True)

  age = create_related_field('age', True, True)
  material_filler = create_related_field('material_filler', False, True)
  cover = create_related_field('cover', True, True)
  
  objects = PillowManager()