from api.models import Product
from api.serializers.category import CategorySerializer
from .product import ProductSerializer

class BestProductSerializer(ProductSerializer):
  sizes = None
  category = CategorySerializer()
  
  class Meta:
    fields = ['shortcut', 'name_en', 'name_ru', 'name_ro', 'discount', 'category']
    model = Product