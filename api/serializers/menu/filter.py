from rest_framework.serializers import ModelSerializer, SerializerMethodField
from api import models
from ..size import SizePriceSerializer

class MenuFilterSerializer(ModelSerializer):
  price = SerializerMethodField()
  
  def get_price(self, obj):
    if hasattr(obj, 'price'):
      return SizePriceSerializer(obj.price.size).data
    return None
  
  class Meta:
    exclude = ['id', 'menu_sub_category', 'products', 'order']
    model = models.MenuFilter
    