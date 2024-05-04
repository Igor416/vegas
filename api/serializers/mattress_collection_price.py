from rest_framework.serializers import ModelSerializer
from api import models
from .extractors import PriceExtractor

class MattressCollectionsPriceSerializer(PriceExtractor, ModelSerializer):
  class Meta:
    fields = '__all__'
    model = models.Choice

  def to_representation(self, obj):
    size = None
    for m in models.Mattress.objects.filter(collection=obj):
      first = m.sizes.first()
      if size is None:
        size = first
      elif first:
        if size.priceEUR > first.priceEUR:
          size = first

    return {
      obj.property_en: self.extract_price({'priceEUR': size.priceEUR if size else 0})
    }