from django.db import models
from .file import File
from ..product import Product

class Image(File):
  folder = 'products'
  image = models.ImageField('Фото товара', upload_to=folder)
  is_shortcut = models.BooleanField('Является превью', default=False)
  product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, default=None, verbose_name='Товар', related_name='images')

  def __str__(self):
    name = self.get_name()
    if self.is_shortcut:
      name = name.replace('_', ' ')
      name += ' Для каталога'
    else:
      name = name.replace('_', ' ')
      name = ' '.join(['№ ' + el if el.isnumeric() else el for el in name.split(' ')])

    return name

  class Meta:
    ordering = ['product', 'image']
    verbose_name = 'Фотография'
    verbose_name_plural = 'Фотографии'