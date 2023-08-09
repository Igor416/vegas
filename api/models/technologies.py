from django.db import models
from . import save_langs

class Technology(models.Model):
    isTechnology = models.BooleanField('Это технология (или слой)?', default=False)
    name_en = models.CharField('Название (en)', max_length=32, blank=True)
    name_ru = models.CharField('Название (ru)', max_length=32, unique=True)
    name_ro = models.CharField('Название (ro)', max_length=32, blank=True)
    image = models.ImageField('Фотография', upload_to='images')
    desc_en = models.TextField('Описание (en)')
    desc_ru = models.TextField('Описание (ru)')
    desc_ro = models.TextField('Описание (ro)')

    def get_absolute_url(self):
        return '/media/images/' + self.image.name.split('/')[-1]

    def save(self, *args, **kwargs):
        self.name_en, self.name_ru, self.name_ro = save_langs(self.name_en, self.name_ru, self.name_ro)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'технология {self.name_ru}'

    class Meta:
        verbose_name = 'технология'
        verbose_name_plural = 'технологии'

class LayerMattress(models.Model):
    technology = models.ForeignKey(Technology, on_delete=models.CASCADE)
    product = models.ForeignKey('Mattress', on_delete=models.CASCADE)

    def __str__(self):
        return f'слой матраса {self.product} с технологией {self.technology}'

class LayerPillow(models.Model):
    technology = models.ForeignKey(Technology, on_delete=models.CASCADE)
    product = models.ForeignKey('Pillow', on_delete=models.CASCADE)

    def __str__(self):
        return f'слой подушки {self.product} с технологией {self.technology}'

class LayerMattressPad(models.Model):
    technology = models.ForeignKey(Technology, on_delete=models.CASCADE)
    product = models.ForeignKey('MattressPad', on_delete=models.CASCADE)

    def __str__(self):
        return f'слой наматрасника {self.product} с технологией {self.technology}'