from . import models, catalog as ct
from .meta_products import BestProductSerializer, ListedProductsSerializer, DetailedProductSerializer
from .choice import ChoiceSerializer
from .technologies import TechnologySerializer
from .marker import MarkerSerializer
from .size import BedSheetsSizeSerializer

class ProductSerializerFactory:
    class Meta:
        pass
    
    def __init__(self, model, lang):
        self.model = model
        self.lang = lang
        self.fields = {'Meta': self.Meta}
        
        self.set_serializer()
        self.set_Meta_fields()
        self.set_fields()
    
    def create(self, *args, **kwargs):
        self.Meta.model = self.model
        return type(self.model.get_name() + 'Serializer', (self.serializer, ), self.fields)(*args, **kwargs)
        
class BestProductSerializerFactory(ProductSerializerFactory):
    def set_serializer(self):
        self.serializer = BestProductSerializer
        
    def set_Meta_fields(self):
        self.Meta.fields = ['shortcut', 'name', 'sizes', 'discount', 'category']
    
    def set_fields(self): pass
    
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
        if self.model is not models.Basis:
            default_filtering = ct.get_default_filtering(self.model.get_name())
            many = self.model is not models.Basis and models.has_multiple_rels(self.model, default_filtering)
                
            self.fields.update({
                'default_filtering': default_filtering,
                default_filtering: ChoiceSerializer(self.lang, many=many)
            })
        
            if self.model is models.Mattress:
                self.fields.update({'markers': MarkerSerializer(self.lang, many=True)})

class DetailedProductSerializerFactory(ProductSerializerFactory):
    def set_serializer(self):
        self.serializer = DetailedProductSerializer
    
    def set_Meta_fields(self):
        self.Meta.fields = '__all__'
            
    def set_fields(self):
        for prop in filter(lambda prop: prop != 'rigidity', ct.get_all_props(self.model.get_name())):
            many = models.has_multiple_rels(self.model, prop)
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
            self.fields.update({'sizes': BedSheetsSizeSerializer(self.lang, many=True)})
        elif self.model is models.Basis:
            self.fields.update({'recomended': ChoiceSerializer(many=True)})
