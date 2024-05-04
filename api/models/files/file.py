from django.db import models

class File(models.Model):
  folder = ''
  image = models.ImageField('Фото товара', upload_to=folder)

  def get_absolute_url(self):
    return f'/media/{self.folder}/{self.get_name()}.jpg'

  def get_name(self):
    return self.image.name.split('/')[-1].split('.')[0] #products/[name].jpg -> [name]

  class Meta:
    abstract = True