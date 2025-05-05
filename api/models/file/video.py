from django.db import models
from urllib.request import urlretrieve
from core.settings import BASE_DIR
from .file import File
from ..product import Product

class Video(File):
  folder = 'videos'
  image = models.ImageField('Фото товара', upload_to=folder)
  video_id = models.CharField('Ссылка на видео', max_length=64, unique=True)
  product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, default=None, verbose_name='Товар', related_name='videos')

  def save(self, *args, **kwargs):
    if '=' in self.video_id:
      self.video_id = self.video_id.split('=')[-1]
    elif 'youtu.be' in self.video_id:
      self.video_id = self.video_id.split('/')[-1]
    self.image = urlretrieve(f'http://img.youtube.com/vi/{self.video_id}/hqdefault.jpg', str(BASE_DIR) + f'\\media\\videos\\{self.video_id}.jpg')[0]
    super().save(*args, **kwargs)

  def get_name(self):
    return self.video_id

  def __str__(self):
    return f'видео о товаре: {self.product}'

  class Meta:
    ordering = ['product']
    verbose_name = 'Видео'
    verbose_name_plural = 'Видео'
