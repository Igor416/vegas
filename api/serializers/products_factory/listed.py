from api import models, catalog as ct
from api.serializers.meta_products import ListedProductsSerializer
from api.serializers.choice import ChoiceSerializer
from api.serializers.marker import MarkerSerializer
from .product import ProductSerializerFactory
  
class ListedProductsSerializerFactory(ProductSerializerFactory):
  def set_serializer(self):
    self.serializer = ListedProductsSerializer
  
  def set_Meta_fields(self):
    self.Meta.fields = ['name', 'discount', 'best', 'desc', 'sizes', 'shortcut', 'category']
    
    if self.model is not models.Basis:
      self.Meta.fields.append(ct.get_default_filtering(self.model.get_name()))
      if self.model is models.Mattress:
        self.Meta.fields.append('markers')
      elif self.model is models.BedSheets:
        self.Meta.fields.append('name_' + self.lang)
      
  def set_fields(self):
    super().set_fields()
    if self.model is not models.Basis:
      default_filtering = ct.get_default_filtering(self.model.get_name())
      many = self.model is not models.Basis and self.model.has_multiple_rels(self.model, default_filtering)
        
      self.fields.update({
        'default_filtering': default_filtering,
        default_filtering: ChoiceSerializer(self.lang, many=many)
      })
    
      if self.model is models.Mattress:
        self.fields.update({'markers': MarkerSerializer(self.lang, many=True)})