from django.db import models
from .technology import Technology

class LayerPillow(models.Model):
  technology = models.ForeignKey(Technology, on_delete=models.CASCADE)
  product = models.ForeignKey('Pillow', on_delete=models.CASCADE)

  def __str__(self):
    return f'слой подушки {self.product} с технологией {self.technology}'