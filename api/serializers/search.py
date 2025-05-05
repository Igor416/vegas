from rest_framework.serializers import Serializer, CharField, IntegerField
from api import models
from api.serializers.size import SizeSerializer

class SearchResultSerializer(Serializer):
  link = CharField(max_length=64)
  text = CharField(max_length=64)
  
class CategoryResultSerializer(SearchResultSerializer):
  count = IntegerField()
  
  def to_representation(self, obj):
    return {
      'link': f'/catalog/{obj.name}/all',
      'text': getattr(obj, f'name_{self.lang}_pl'),
      'count': len(getattr(models, obj.name).objects.all())
    }
  
class ProductResultSerializer(SearchResultSerializer):
  priceEUR = IntegerField()
  discount = IntegerField()
  
  def to_representation(self, obj):
    name = getattr(obj, f"name_{self.lang}") if isinstance(obj, models.BedSheets) else obj.name
    return {
      'link': f'/product/{obj.category.name}/{name}',
      'text': f'{getattr(obj.category, f"name_{self.lang}_s")}: {name}',
      'price': SizeSerializer(obj.sizes.all()[0]).data['price'],
      'discount': obj.discount
    }