from django.db import models
from .technology import Technology

class LayerMattressPad(models.Model):
  technology = models.ForeignKey(Technology, on_delete=models.CASCADE)
  product = models.ForeignKey('MattressPad', on_delete=models.CASCADE)

  def __str__(self):
    return f'слой наматрасника {self.product} с технологией {self.technology}'