from django.db import models
from .product import Product
from api.models.choice import Choice
from api.models.products.managers import BasisManager

class Basis(Product):
  distance = models.IntegerField(default=45)
  width = models.IntegerField(default=0)
  legs_height = models.IntegerField(default=0)

  recomended = models.ManyToManyField(Choice, related_name='recomendedBasis', verbose_name='Рекомендовано для матрассов')
  
  objects = BasisManager()

  def __str__(self):
    return f'{self._meta.verbose_name}: {self.name}'
