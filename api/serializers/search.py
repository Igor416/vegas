from rest_framework.serializers import CharField, IntegerField
from . import models, LangExtractor, PriceExtractor

class SearchResultSerializer(LangExtractor, PriceExtractor):
  link = CharField(max_length=64)
  text = CharField(max_length=64)
  
class CategoryResultSerializer(SearchResultSerializer):
  count = IntegerField()
  
  def to_representation(self, obj):
    return {
      'link': f'/catalog/{obj.name}/all',
      'text': getattr(obj, f'name_{obj}_pl'),
      'count': len(getattr(models, obj.name).objects.get_all())
    }
  
class ProductResultSerializer(SearchResultSerializer):
  priceEUR = IntegerField()
  discount = IntegerField()
  
  def to_representation(self, obj):
    return {
      'link': f'/product/{obj.category.name}/{getattr(obj, f"name_{self.lang}")}',
      'text': f'{getattr(obj.category, f"name_{self.lang}_s")}: {getattr(obj, f"name_{self.lang}") if obj.get_name() == models.BedSheets.get_name() else obj.name}',
      'priceEUR': obj.sizes.all()[0].priceEUR,
      'discount': obj.discount
    }