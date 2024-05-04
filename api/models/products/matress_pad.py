from django.db import models
from .product import Product
from .supplies import create_related_field
from api.models.technologies import Technology, LayerMattressPad
from api.models.products.managers import MattressPadManager

class MattressPad(Product):
  height = models.IntegerField(default=0)
  case = models.BooleanField(default=True)

  structure = models.ManyToManyField(Technology, through=LayerMattressPad, through_fields=('product', 'technology'), related_name='structure_%(class)s', verbose_name='Структура', blank=True)
  technologies = models.ManyToManyField(Technology, related_name='technologies_%(class)s', verbose_name='Технологии', blank=True)

  age = create_related_field('age', True, True)
  mattresspad_type = create_related_field('mattresspad_type', False, True)
  binding = create_related_field('binding')
  cover = create_related_field('cover', True, True)
  
  objects = MattressPadManager()