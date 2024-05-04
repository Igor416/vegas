from django.db import models
from urllib.request import urlretrieve
from vegas.settings import BASE_DIR
from .file import File

class Video(File):
  folder = 'videos'
  video_id = models.CharField('Ссылка на видео', max_length=64, unique=True)

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
    return f'видео о товаре с id: {self.video_id}'

  class Meta:
    verbose_name = 'видео'
    verbose_name_plural = 'видео'
