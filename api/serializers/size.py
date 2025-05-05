from rest_framework.serializers import ModelSerializer, FloatField, SerializerMethodField
from api.models import Size

CURRENCIES = ('EUR', 'MDL', 'RON', 'USD')

class SizeSerializer(ModelSerializer):
  priceEUR = FloatField()
  priceMDL = FloatField()
  priceRON = FloatField()
  priceUSD = FloatField()
  
  class Meta:
    model = Size
    exclude = ['id', 'product']
  
  def to_representation(self, instance):
    r = super().to_representation(instance)
    r['price'] = {curr: r.pop('price' + curr) for curr in CURRENCIES}
    return r

class SizePriceSerializer(SizeSerializer):
  class Meta:
    model = Size
    fields = ['priceEUR', 'priceMDL', 'priceRON', 'priceUSD']
  
  def to_representation(self, instance):
    r = super().to_representation(instance)
    return r['price']

class SizeWithShortcutSerializer(SizeSerializer):
  shortcut = SerializerMethodField()
  
  def get_shortcut(self, obj):
    return obj.product.shortcut.get_absolute_url()

from .products.best import BestProductSerializer

class SizeWithProductSerializer(SizeSerializer):
  product = BestProductSerializer()
  
  class Meta(SizeSerializer.Meta):
    exclude = ['id']