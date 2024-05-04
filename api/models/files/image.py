from django.db import models
from .file import File

class Image(File):
  folder = 'products'
  image = models.ImageField('Фото товара', upload_to=folder)

  def __str__(self):
    name = self.get_name()
    if self.is_shortcut():
      name = name.replace('_', ' ')
      name += ' Для каталога'
    else:
      name = name.replace('_', ' ')
      name = ' '.join(name.split(' ')[:-1]) + ' № ' + name.split(' ')[-1]

    return name

  def is_shortcut(self):
    return not self.get_name().split('_')[-1].isdigit()

  class Meta:
    verbose_name = 'фотография'
    verbose_name_plural = 'фотографии'