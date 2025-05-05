from django.db import models
from uuid import uuid4

class Category(models.Model):
  id = models.UUIDField('ID', primary_key=True, default=uuid4)

  name = models.CharField('Название', max_length=32, unique=True)
  name_s_en = models.CharField('Название (en) (ед. число)', max_length=32)
  name_pl_en = models.CharField('Название (en) (мн. число)', max_length=32)
  name_s_ru = models.CharField('Название (ru) (ед. число)', max_length=32)
  name_pl_ru = models.CharField('Название (ru) (мн. число)', max_length=32)
  name_s_ro = models.CharField('Название (ro) (ед. число)', max_length=32)
  name_pl_ro = models.CharField('Название (ro) (мн. число)', max_length=32)
  
  desc_en = models.TextField('Описание (en)', blank=True)
  desc_ru = models.TextField('Описание (ru)', blank=True)
  desc_ro = models.TextField('Описание (ro)', blank=True)
  
  order = models.SmallIntegerField('Порядок', default=0)
  disabled = models.BooleanField('Отключена', default=False)

  def __str__(self):
    return self.name_s_ru

  class Meta:
    ordering = ['order']
    verbose_name = 'категория'
    verbose_name_plural = 'категории'