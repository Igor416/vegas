from django.db import models
from .product import Product
from .supplies import create_related_field
from api.models.products.managers import BlanketManager

class Blanket(Product):
  density = models.IntegerField(default=0)

  blanket_type = create_related_field('blanket_type', False, True)
  age = create_related_field('age', True, True)
  filling = create_related_field('filling', True, True)
  blanket_color = create_related_field('blanket_color')
  cover = create_related_field('cover', True, True)
  
  objects = BlanketManager()