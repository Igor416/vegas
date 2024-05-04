from django.db import models
from .choice import Choice
from .size import Size
from .products import Mattress

class Stock(models.Model):
  discount = models.SmallIntegerField('Скидка', default=0)
  desc_en = models.TextField('Описание (en)')
  desc_ru = models.TextField('Описание (ru)')
  desc_ro = models.TextField('Описание (ro)')
  expiry = models.DateField('Дата окончания')

  collections = models.ManyToManyField(Choice, related_name='collection_stock', verbose_name='Коллекции')
  sizes = models.ManyToManyField(Size, related_name='sizes_stock', verbose_name='Размеры', blank=True)

  def __str__(self):
    lst = [collection.property_en for collection in self.collections.all()]
    return f'Акции на {self.discount} процентов на коллекци{"ю" if len(lst) == 1 else "и"}: {", ".join(lst)}'

  def save(self, *args, **kwargs):
    super().save(*args, **kwargs)
    if len(self.sizes.all()) == 0:
      for collection in self.collections.all():
        for m in Mattress.objects.filter(collection=collection):
          m.discount = self.discount
          m.save()

    else:
      for collection in self.collections.all():
        for m in Mattress.objects.filter(collection=collection):
          for size in self.sizes.all():
            m_size = m.sizes.filter(width=size.width, length=size.length)
            if len(m_size) != 0:
              m_size = m_size[0]
            else:
              continue
            m_size.discount = self.discount
            m_size.save()

  class Meta:
    verbose_name = 'акция'
    verbose_name_plural = 'акции'