from django.db import models
from django.core.exceptions import ObjectDoesNotExist

class Marker(models.Model):
  name = models.CharField('Маркер', max_length=64, unique=True, primary_key=True)

  @staticmethod
  def add_markers(mattress):
    markers = [
      'height_' + str(mattress.height),
      'max_pressure_' + str(mattress.max_pressure),
      'springs_' + str(mattress.springs)
    ]

    rev = lambda s: 'rigidity_' +  '-'.join(s.replace('rigidity_', '').split('-')[::-1])

    if mattress.rigidity2:
      markers.append('rigidity_' + mattress.rigidity1.property_en + '-' + mattress.rigidity2.property_en)
    else:
      markers.append('rigidity_' + mattress.rigidity1.property_en)

    mattress.markers.add(*mattress.visible_markers.all())
    for marker in markers:
      if marker.startswith('rigidity_'):
        if len(Marker.objects.filter(name=marker.lower())) == 0 and len(Marker.objects.filter(name=rev(marker.lower()))) == 0:
          mattress.markers.create(name=marker.lower())
        else:
          try:
            mattress.markers.add(Marker.objects.get(name=marker.lower()))
          except ObjectDoesNotExist:
            mattress.markers.add(Marker.objects.get(name=rev(marker.lower())))
          else:
            try:
              mattress.markers.add(Marker.objects.get(name=marker.lower()))
            except ObjectDoesNotExist:
              mattress.markers.create(name=marker.lower())

  def __str__(self):
    return f'маркер {self.name}'

  class Meta:
    verbose_name = 'маркер'
    verbose_name_plural = 'маркеры'