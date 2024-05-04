from api import models
from api.serializers.meta_products import ProductSerializer
from api.serializers import SizeSerializer

class ProductSerializerFactory:
  serializer = ProductSerializer
  model = models.products.Product
  
  class Meta:
    model = models.products.Product
    fields: list[str] | str = []
  
  def __init__(self, model, lang, country):
    self.model = model
    self.lang = lang
    self.country = country
    self.fields: dict[str, object] = {'Meta': self.Meta}
    
    self.set_serializer()
    self.set_Meta_fields()
    self.set_fields()
  
  def set_serializer(self): pass
    
  def set_Meta_fields(self): pass
  
  def set_fields(self):
    self.fields.update({'sizes': SizeSerializer(country=self.country, many=True)})
  
  def create(self, *args, **kwargs):
    self.Meta.model = self.model
    return type(self.model.get_name() + 'Serializer', (self.serializer, ), self.fields)(*args, **kwargs)