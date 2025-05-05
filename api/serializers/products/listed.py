from rest_framework.serializers import SerializerMethodField
from api.models import Product
from .product import ProductSerializer
from ..size import SizeSerializer
from ..category import CategorySerializer

class ListedProductSerializer(ProductSerializer):
  category = CategorySerializer()
  desc_en = SerializerMethodField()
  desc_ru = SerializerMethodField()
  desc_ro = SerializerMethodField()
  markers = SerializerMethodField()
  cheapest_size = SizeSerializer()
  
  class Meta:
    fields = ['name_en', 'name_ru', 'name_ro', 'category', 'discount', 'best', 'desc_en', 'desc_ru', 'desc_ro', 'shortcut', 'markers', 'cheapest_size']
    model = Product

  def get_desc(self, desc):
    shortened, symbols, words = '', 288, 0
    for sent in desc.split('.'):
      words += len(sent.strip())
      if words <= symbols:
        shortened += sent + '. '
      else:
        return shortened
    return desc
    
  def get_desc_en(self, obj):
    return self.get_desc(obj.desc_en)
    
  def get_desc_ru(self, obj):
    return self.get_desc(obj.desc_ru)
    
  def get_desc_ro(self, obj):
    return self.get_desc(obj.desc_ro)
  
  def get_markers(self, obj):
    return obj.markers.split(',') if obj.markers else []