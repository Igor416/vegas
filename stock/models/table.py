from django.db import models

class Table(models.Model):
  year = models.PositiveSmallIntegerField('Год', default=2024)
  month = models.PositiveSmallIntegerField('Месяц', default=8)

  def __str__(self):
    return f'Таблица за {self.year}/{"0" if self.month < 10 else ""}{self.month}'

  class Meta:
    unique_together = ('year', 'month')
    verbose_name = 'таблица'
    verbose_name_plural = 'таблицы'