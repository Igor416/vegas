from django.db import models
from api.models.size import Size

class Stockable(models.Model):
  size = models.ForeignKey(Size, on_delete=models.CASCADE, verbose_name='Товар')

  def __str__(self):
    return f'{self.size}, добавлен {self.actions.date}'

  class Meta:
    verbose_name = 'модель'
    verbose_name_plural = 'модели'