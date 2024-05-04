from api.serializers.meta_products import BestProductSerializer
from .product import ProductSerializerFactory
    
class BestProductSerializerFactory(ProductSerializerFactory):
  def set_serializer(self):
    self.serializer = BestProductSerializer
    
  def set_Meta_fields(self):
    self.Meta.fields = ['shortcut', 'name', 'sizes', 'discount', 'category']