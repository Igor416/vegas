from rest_framework.serializers import Serializer
from .price_manager import PriceManager

class PriceExtractor(Serializer):
  def __init__(self, *args, **kwargs):
    self.country = kwargs.pop('country', 'MD')
    super().__init__(*args, **kwargs)

  def extract_price(self, container):
    return PriceManager(container, self.country).container