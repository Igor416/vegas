from django.db import models
from uuid import uuid4

class Technology(models.Model):
  id = models.UUIDField('ID', primary_key=True, default=uuid4)
  
  is_technology = models.BooleanField('Это технология (или слой)?', default=False)
  name_en = models.CharField('Название (en)', max_length=32, blank=True)
  name_ru = models.CharField('Название (ru)', max_length=32, unique=True)
  name_ro = models.CharField('Название (ro)', max_length=32, blank=True)
  image = models.ImageField('Фотография', upload_to='images')
  desc_en = models.TextField('Описание (en)')
  desc_ru = models.TextField('Описание (ru)')
  desc_ro = models.TextField('Описание (ro)')

  def get_absolute_url(self):
    return '/media/images/' + self.image.name.split('/')[-1]

  def __str__(self):
    return f'технология {self.name_ru}'

  class Meta:
    verbose_name = 'технология'
    verbose_name_plural = 'технологии'