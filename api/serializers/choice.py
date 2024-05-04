from rest_framework.serializers import ModelSerializer
from api import models
from .extractors import LangExtractor

class ChoiceSerializer(LangExtractor, ModelSerializer):
  class Meta:
    exclude = ['name', 'category']
    model = models.Choice

  def to_representation(self, obj):
    return getattr(obj, 'property_' + self.lang)