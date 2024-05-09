from django.db import models
from django.utils.timezone import datetime
from .stockable import Stockable

class Action(models.Model):
  TYPES = (
    ('A', 'Добавить в систему'),
    ('O', 'Пометить как бронь'),
    ('C', 'Отменить бронь'),
    ('S', 'Отметить как проданный'),
    ('R', 'Получить возврат'),
    ('T', 'Переместить')
  )
  
  PLACES = (
    ('CA', 'Машина'),
    ('SN', 'Главный склад'),
    ('SO', 'Склад 2'),
    ('JU', 'Джамбо'),
    ('CI', 'Чеканы'),
    ('RI', 'Рышкановка'),
    ('D1', 'Игорь'),
    ('D2', 'Оргеев'),
    ('D3', 'Унгены'),
  )
  
  type = models.CharField('Тип действия', max_length=1, choices=TYPES, default='A')
  person = models.CharField('Деятель', max_length=2)
  place = models.CharField('Место товара', max_length=2, choices=PLACES)
  date = models.DateField('Дата', default=datetime.today)
  stockable = models.ForeignKey(Stockable, on_delete=models.CASCADE, verbose_name='Модель', related_name='actions')
  
  def __str__(self):
    return f'{self.person} сделал действие: "{self.get_type_display()}" над {self.stockable.print_size()} {self.date} и теперь он в месте: {self.get_place_display()}'

  class Meta:
    verbose_name = 'действие'
    verbose_name_plural = 'действия'