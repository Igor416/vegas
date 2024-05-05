from rest_framework.serializers import ModelSerializer
from api import models
from .extractors import PriceExtractor

class SizeSerializer(PriceExtractor, ModelSerializer):
  class Meta:
    exclude = ['id', 'category', 'product']
    model = models.Size
  
  def to_representation(self, instance):
    return self.extract_price(super().to_representation(instance))

class BedSheetsSizeSerializer(SizeSerializer):
  class Meta(SizeSerializer.Meta):
    model = models.BedSheetsSize