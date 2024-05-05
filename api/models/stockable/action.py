from django.db import models
from django.utils.timezone import datetime
from .stockable import Stockable

class Action(models.Model):
  TYPES = (
    ('A', 'Добавить в систему'),
    ('O', 'Пометить как бронь'),
    ('C', 'Отменить бронь'),
    ('S', 'Отметить как проданный'),
    ('T', 'Переместить')
  )
  
  PLACES = (
    ('SN', 'Новый склад'),
    ('SO', 'Старый склад'),
    ('JU', 'Джамбо'),
    ('CI', 'Чеканы'),
    ('RI', 'Рышкановка'),
    ('D1', 'Игорь'),
    ('D2', 'Оргеев'),
    ('D3', 'Унгены'),
    ('CA', 'Машина'),
  )
  
  type = models.CharField('Тип действия', max_length=1, choices=TYPES, default='A')
  person = models.CharField('Деятель', max_length=2)
  place = models.CharField('Место товара', max_length=2, choices=PLACES)
  date = models.DateField('Дата', default=datetime.today)
  stockable = models.ForeignKey(Stockable, on_delete=models.CASCADE, verbose_name='Модель', related_name='actions')
  
  def __str__(self):
    return f'{self.person} сделал действие: {self.type} над {self.stockable.size} {self.date} и теперь он в месте: {self.place}'

  class Meta:
    verbose_name = 'действие'
    verbose_name_plural = 'действия'