from django.db import models
from .product import Product
from .supplies import create_related_field
from api.models.products.managers import BedManager

class Bed(Product):
  headboard_height = models.IntegerField(default=0)
  extra_length = models.IntegerField(default=0)
  extra_width = models.IntegerField(default=0)

  bed_type = create_related_field('bed_type', False, True)
  
  objects = BedManager()