from django.db import models
from django.utils.functional import cached_property
from .product import Product
from uuid import uuid4

class SizeManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().annotate(
      discounted_price=models.ExpressionWrapper(
        models.F('priceEUR') * (100 - models.F('discount')) / 100.0,
        output_field=models.FloatField()
      )
    ).order_by(
      models.F('on_sale').desc(),
      'discounted_price'
    )

class Size(models.Model):
  id = models.UUIDField('ID', primary_key=True, default=uuid4)
  
  width = models.SmallIntegerField('Ширина', default=80)
  length = models.SmallIntegerField('Длина', default=200)
  priceEUR = models.SmallIntegerField('Цена (евро)', default=0)
  discount = models.SmallIntegerField('Скидка (%)', default=0)
  on_sale = models.BooleanField('На распродаже', default=False)
  out_of_stock = models.BooleanField('Отсуствует', default=True)
  product = models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True, related_name='sizes', verbose_name='Товар')
  
  objects = SizeManager()

  def __str__(self):
    return f'Размер продукта {self.product}: {self.width} x {self.length} по цене {self.priceEUR} (EUR){f", со скидкой {self.discount}%" if self.discount != 0 else ""}{" (распродажа)" if self.on_sale else ""}'

  @cached_property
  def priceMDL(self):
    return round(self.priceEUR * 20.5, 2)
  
  @cached_property
  def priceRON(self):
    return round(self.priceEUR * 5, 2)
  
  @cached_property
  def priceUSD(self):
    return round(self.priceEUR * 1.1, 2)

  class Meta:
    ordering = ['product', '-on_sale']
    verbose_name = 'Размер'
    verbose_name_plural = 'Размеры'