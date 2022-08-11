from django.db import models

# Create your models here.
class Banner(models.Model):
    banner_en = models.ImageField('Баннер (en)', upload_to="banners")
    banner_ru = models.ImageField('Баннер (ru)', upload_to="banners")
    banner_ro = models.ImageField('Баннер (ro)', upload_to="banners")

    def __str__(self):
        return self.banner_ru.name

    class Meta:
        verbose_name = 'баннер'
        verbose_name_plural = 'баннеры'

class Review(models.Model):
    title = models.CharField('Заглавие', max_length=64)
    date = models.DateField('Дата')
    city = models.CharField('Город', max_length=16)
    text = models.TextField('Отзыв')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'отзыв'
        verbose_name_plural = 'отзывы'