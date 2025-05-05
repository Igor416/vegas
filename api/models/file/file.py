from django.db import models
from uuid import uuid4

class File(models.Model):
  id = models.UUIDField('ID', primary_key=True, default=uuid4)
  
  def get_absolute_url(self):
    return f'/media/{self.folder}/{self.get_name()}.jpg'

  def get_name(self):
    return self.image.name.split('/')[-1].split('.')[0] #products/[name].jpg -> [name]

  class Meta:
    abstract = True