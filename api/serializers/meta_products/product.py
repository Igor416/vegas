from rest_framework.serializers import ModelSerializer, SerializerMethodField
from api.serializers.extractors import LangExtractor, PriceExtractor
from api.serializers.category import CategorySerializer
from api.serializers.size import SizeSerializer
from api.serializers.files import ImageSerializer

class ProductSerializer(LangExtractor, PriceExtractor, ModelSerializer):
  shortcut = ImageSerializer()

  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    self.fields['category'] = CategorySerializer(lang=self.lang)

  def to_representation(self, obj):
    r = super().to_representation(obj)
    r['sizes'] = sorted(
      sorted(r['sizes'], key=lambda size: size['price']['EUR'] * (100 - size['discount']) / 100),
      key=lambda size: size['on_sale'],
      reverse=True
    )
    return r