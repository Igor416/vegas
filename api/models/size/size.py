from django.db import models
from api.models.category import Category

class Size(models.Model):
  category = models.ForeignKey(Category, on_delete=models.CASCADE, blank=True, null=True, verbose_name='Категория')
  product = models.CharField('Название продукта', max_length=32, blank=True)
  width = models.SmallIntegerField('Ширина', default=80)
  length = models.SmallIntegerField('Длина', default=200)
  priceEUR = models.SmallIntegerField('Цена (евро)', default=0)
  discount = models.SmallIntegerField('Скидка (%)', default=0)
  on_sale = models.BooleanField('На распродаже', default=False)

  def set_product_and_category(self, product, category):
    self.product = product
    self.category = category
    self.save()

  def save(self, *args, **kwargs):
    if self.on_sale:
      self.discount = 30
    super().save(*args, **kwargs)

  def __str__(self):
    return f'Размер продукта {self.product}: {self.width} x {self.length} по цене {self.priceEUR} (EUR){f", со скидкой {self.discount}%" if self.discount != 0 else ""}'

  class Meta:
    verbose_name = 'размер'
    verbose_name_plural = 'размеры'