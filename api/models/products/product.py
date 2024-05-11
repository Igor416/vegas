from django.db import models
from api import catalog as ct
from api.models.category import Category
from api.models.size import Size
from api.models.files import Image, Video

class Product(models.Model):
  name = models.CharField('Название', max_length=32, unique=True)
  desc_en = models.TextField('Описание (en)')
  desc_ru = models.TextField('Описание (ru)')
  desc_ro = models.TextField('Описание (ro)')
  discount = models.SmallIntegerField('Скидка (%)', default=0)
  best = models.BooleanField('Лидер продаж', default=False)

  category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='Категория', null=True)
  sizes = models.ManyToManyField(Size, related_name='sizes%(class)s', verbose_name='Размеры')
  shortcut = models.ForeignKey(Image, null=True, on_delete=models.SET_NULL, verbose_name='Фото на каталог')
  images = models.ManyToManyField(Image, related_name='images%(class)s', verbose_name='Фотографии товара', blank=True)
  videos = models.ManyToManyField(Video, related_name='videos%(class)s', verbose_name='Видео товара', blank=True)
  structure = None
  technologies = None

  @classmethod
  def get_name(cls):
    return cls.__name__

  def __str__(self):
    default_filtering = ct.get_default_filtering(self.get_name())
    try:
      property = getattr(self, default_filtering).property_ru
    except:
      property = getattr(self, default_filtering).first().property_ru
    return f'{self._meta.verbose_name}: {self.name}, {ct.get_prop_trans(default_filtering)}: {property}'

  def save(self, *args, **kwargs):
    super().save(*args, **kwargs)
    if self.structure:
      self.structure.update(isTechnology=False)
    if self.technologies:
      self.technologies.update(isTechnology=True)
    if self.category:
      self.sizes.all().update(product=self.name, category=self.category)

  @staticmethod
  def has_multiple_rels(model, field):
    if field == 'rigidity':
      return False
    return hasattr(getattr(model, field), 'rel')

  class Meta:
    abstract = True