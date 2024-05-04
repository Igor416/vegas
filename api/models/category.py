from django.db import models
from api import catalog as ct
from api.translations import EN, RU, RO

class Category(models.Model):
  choices = ct.get_pr_choices()

  name = models.CharField('Название', max_length=32, choices=choices, unique=True, primary_key=True)
  name_en_s = models.CharField(max_length=32)
  name_en_pl = models.CharField(max_length=32)
  name_ru_s = models.CharField(max_length=32)
  name_ru_pl = models.CharField(max_length=32)
  name_ro_s = models.CharField(max_length=32)
  name_ro_pl = models.CharField(max_length=32)
  
  desc_en = models.TextField('Описание (en)', blank=True)
  desc_ru = models.TextField('Описание (ru)', blank=True)
  desc_ro = models.TextField('Описание (ro)', blank=True)

  def __str__(self):
    return self.name_ru_s

  def save(self, *args, **kwargs):
    self.name_en_s = ct.get_pr_trans(self.name, EN, False)
    self.name_en_pl = ct.get_pr_trans(self.name, EN, True)
    self.name_ru_s = ct.get_pr_trans(self.name, RU, False)
    self.name_ru_pl = ct.get_pr_trans(self.name, RU, True)
    self.name_ro_s = ct.get_pr_trans(self.name, RO, False)
    self.name_ro_pl = ct.get_pr_trans(self.name, RO, True)
    super().save(*args, **kwargs)

  class Meta:
    verbose_name = 'категория'
    verbose_name_plural = 'категории'