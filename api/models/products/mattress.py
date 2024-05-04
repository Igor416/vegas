from django.db import models
from .product import Product
from .supplies import create_related_field
from api.models.marker import Marker
from api.models.technologies import Technology, LayerMattress
from api.models.products.managers import MattressManager

class Mattress(Product):
  height = models.IntegerField(default=0)
  springs = models.IntegerField(default=0)
  max_pressure = models.IntegerField(default=0)
  lifetime = models.IntegerField(default=10)
  case = models.BooleanField(default=True)
  visible_markers = models.ManyToManyField(Marker, related_name='visible_markers', verbose_name='Маркеры', blank=True)
  markers = models.ManyToManyField(Marker, related_name='markers')

  structure = models.ManyToManyField(Technology, through=LayerMattress, through_fields=('product', 'technology'), related_name='structure_%(class)s', verbose_name='Структура', blank=True)
  technologies = models.ManyToManyField(Technology, related_name='technologies_%(class)s', verbose_name='Технологии', blank=True)

  mattress_type = create_related_field('mattress_type', False, True)
  age = create_related_field('age', True, True)
  rigidity1 = create_related_field('rigidity1', True)
  rigidity2 = create_related_field('rigidity2', True)
  collection = create_related_field('collection')
  springblock = create_related_field('springblock')
  construction = create_related_field('construction')

  objects =  MattressManager()

  def save(self, *args, **kwargs):
    super().save(*args, **kwargs)
    if self.category and self.max_pressure:
      Marker.add_markers(self)
      super().save(*args, **kwargs)