from django.db import models
from .technology import Technology

class LayerMattress(models.Model):
  technology = models.ForeignKey(Technology, on_delete=models.CASCADE)
  product = models.ForeignKey('Mattress', on_delete=models.CASCADE)

  def __str__(self):
    return f'слой матраса {self.product} с технологией {self.technology}'