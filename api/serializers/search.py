from rest_framework.serializers import CharField, IntegerField
from api import models
from .extractors import LangExtractor, PriceExtractor

class SearchResultSerializer(LangExtractor):
  link = CharField(max_length=64)
  text = CharField(max_length=64)
  
class CategoryResultSerializer(SearchResultSerializer):
  count = IntegerField()
  
  def to_representation(self, obj):
    return {
      'link': f'/catalog/{obj.name}/all',
      'text': getattr(obj, f'name_{obj}_pl'),
      'count': len(getattr(models, obj.name).objects.all())
    }
  
class ProductResultSerializer(SearchResultSerializer, PriceExtractor):
  priceEUR = IntegerField()
  discount = IntegerField()
  
  def to_representation(self, obj):
    name = getattr(obj, f"name_{self.lang}") if isinstance(obj, models.BedSheets) else obj.name
    return self.extract_price({
      'link': f'/product/{obj.category.name}/{name}',
      'text': f'{getattr(obj.category, f"name_{self.lang}_s")}: {name}',
      'priceEUR': obj.sizes.all()[0].priceEUR,
      'discount': obj.discount
    })