from django.db import models
from django.core.exceptions import ObjectDoesNotExist

class Marker(models.Model):
  name = models.CharField('Маркер', max_length=64, unique=True, primary_key=True)

  class Meta:
    verbose_name = 'маркер'
    verbose_name_plural = 'маркеры'

  def __str__(self):
    return f'маркер {self.name}'
    
def add_markers(mattres):
    markers = [
      'height_' + str(mattres.height),
      'max_pressure_' + str(mattres.max_pressure),
      'springs_' + str(mattres.springs)
    ]

    rev = lambda s: 'rigidity_' +  '-'.join(s.replace('rigidity_', '').split('-')[::-1])

    if mattres.rigidity2:
      markers.append('rigidity_' + mattres.rigidity1.property_en + '-' + mattres.rigidity2.property_en)
    else:
      markers.append('rigidity_' + mattres.rigidity1.property_en)

    mattres.markers.add(*mattres.visible_markers.all())
    for marker in markers:
      if marker.startswith('rigidity_'):
        if len(Marker.objects.filter(name=marker.lower())) == 0 and len(Marker.objects.filter(name=rev(marker.lower()))) == 0:
          mattres.markers.create(name=marker.lower())
        else:
          try:
            mattres.markers.add(Marker.objects.get(name=marker.lower()))
          except ObjectDoesNotExist:
            mattres.markers.add(Marker.objects.get(name=rev(marker.lower())))
      else:
        try:
          mattres.markers.add(Marker.objects.get(name=marker.lower()))
        except ObjectDoesNotExist:
          mattres.markers.create(name=marker.lower())