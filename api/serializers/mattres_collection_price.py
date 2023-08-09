from . import models, PriceSerializer

class MattressColectionsPriceSerializer(PriceSerializer):
  class Meta:
    fields = '__all__'
    model = models.Choice

  def to_representation(self, obj):
    size = None
    for m in models.Mattress.objects.filter(collection=obj):
      if size is None:
        size = m.sizes.first()
      elif not m.sizes.first() is None:
        if size.priceEUR > m.sizes.first().priceEUR:
          size = m.sizes.first()

    return {
      obj.property_en: self.extract_price({'priceEUR': size.priceEUR})
    }