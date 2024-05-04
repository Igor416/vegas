from rest_framework.serializers import ModelSerializer
from api import models
from .extractors import LangExtractor

class MarkerSerializer(LangExtractor, ModelSerializer):
  class Meta:
    fields = ['name']
    model = models.Marker

  def to_representation(self, obj):
    if obj.name.startswith('rigidity_'):
      return f'/media/markers/{obj.name}_{self.lang}.jpg'
    return f'/media/markers/{obj.name}.jpg'