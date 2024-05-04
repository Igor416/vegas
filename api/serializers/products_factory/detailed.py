from api import models, catalog as ct
from api.serializers.meta_products import DetailedProductSerializer
from api.serializers.choice import ChoiceSerializer
from api.serializers.technologies import TechnologySerializer
from api.serializers.marker import MarkerSerializer
from api.serializers.size import SizeSerializer, BedSheetsSizeSerializer
from .product import ProductSerializerFactory

class DetailedProductSerializerFactory(ProductSerializerFactory):
  def set_serializer(self):
    self.serializer = DetailedProductSerializer
  
  def set_Meta_fields(self):
    self.Meta.fields = '__all__'
      
  def set_fields(self):
    super().set_fields()
    for prop in filter(lambda prop: prop != 'rigidity', ct.get_all_props(self.model.get_name())):
      many = self.model.has_multiple_rels(self.model, prop)
      serializer = ChoiceSerializer(self.lang, many=many)
      self.fields.update({prop: serializer})

    if self.model is models.Mattress or self.model is models.Pillow or self.model is models.MattressPad:
      self.fields.update({'structure': TechnologySerializer(self.lang, many=True)})
      if self.model is not models.Pillow:
        self.fields.update({'technologies': TechnologySerializer(self.lang, many=True)})
        
    if self.model is models.Mattress:
      self.fields.update({
        'rigidity1': ChoiceSerializer(self.lang),
        'rigidity2': ChoiceSerializer(self.lang),
        'markers': MarkerSerializer(self.lang, many=True)
      })
    elif self.model is models.BedSheets:
      self.fields.update({'sizes': BedSheetsSizeSerializer(country=self.country, many=True)})
    elif self.model is models.Basis:
      self.fields.update({'recomended': ChoiceSerializer(many=True)})
