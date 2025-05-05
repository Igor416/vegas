from django.db import models
from .size import Size
from .menu import MenuFilter
from uuid import uuid4

class CollectionPrice(models.Model):
  id = models.UUIDField('ID', primary_key=True, default=uuid4)
 
  collection = models.OneToOneField(MenuFilter, on_delete=models.CASCADE, null=True, verbose_name='Коллекция', related_name='price')
  size = models.OneToOneField(Size, on_delete=models.SET_NULL, null=True, verbose_name='Размер', related_name='collection')

  def __str__(self):
    return f'Цена для коллекции "{self.collection.name_ru}": {self.size.priceEUR}'
    
  class Meta:
    verbose_name = 'Цена коллекции'
    verbose_name_plural = 'Цены коллекций'