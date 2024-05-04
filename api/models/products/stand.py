from django.db import models
from .product import Product
from .supplies import create_related_field
from api.models.products.managers import StandManager

class Stand(Product):
  height = models.IntegerField(default=0)

  material = create_related_field('material', False, True)
  
  objects = StandManager()