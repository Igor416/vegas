from rest_framework.serializers import ModelSerializer, CharField
from . import models
from .catalog import Manager

manager = Manager()

langs = ['en', 'ru', 'ro']

class CategorySerializer(ModelSerializer):
    class Meta:
        exclude = ['id', 'name']
        model = models.Category

    def __init__(self, *args, **kwargs):
        self.lang, *args = args
        super(CategorySerializer, self).__init__(*args, **kwargs)

    def to_representation(self, obj):
        return {
            'name': obj.name,
            'name_s': getattr(obj, f'name_{self.lang}_s'),
            'name_pl': getattr(obj, f'name_{self.lang}_pl'),
            'desc': getattr(obj, f'desc_{self.lang}'),
        }
    
class ChoiceSerializer(ModelSerializer):
    class Meta:
        exclude = ['name', 'category']
        model = models.Choice

    def __init__(self, lang, *args, **kwargs):
        super(ChoiceSerializer, self).__init__(*args, **kwargs)
        self.lang = lang

    def to_representation(self, obj):
        return getattr(obj, 'property_' + self.lang)

class SizeSerializer(ModelSerializer):
    class Meta:
        exclude = ['id', 'category']
        model = models.Size

class ImageSerializer(ModelSerializer):
    class Meta:
        fields = ['image']
        model = models.Image

    def to_representation(self, obj):
        return obj.get_absolute_url()

class VideoSerializer(ModelSerializer):
    class Meta:
        fields = ['video']
        model = models.Video

    def to_representation(self, obj):
        return obj.get_absolute_url()

class RecomendedSerializer(ModelSerializer):
    class Meta:
        fields = ['name']
        model = models.Basis

class ProductSerializer(ModelSerializer):
    def to_representation(self, instance):
        r = super().to_representation(instance)
        r['desc'] = r.pop('desc_' + self.lang)
        return r

class ProductListSerializer(ProductSerializer):
    def __init__(self, *args, **kwargs):
        super(ProductSerializer, self).__init__(*args, **kwargs)

        all_props = manager.get_all_props(self.model.get_name())
        all_props.remove(self.default_filtering)

        for field in list(self.fields.keys()):
            if field in all_props or field.startswith('rigidity'):
                self.fields.pop(field)
            elif field.startswith('desc') and not field.endswith(self.lang):
                self.fields.pop(field)

def create_serializer(model, lang):
    class Meta:
        exclude = ['category', 'images', 'videos']
        depth = 1

    setattr(Meta, 'model', model)

    fields = {
        'Meta': Meta,
        'model': model,
        'lang': lang,
        'shortcut': ImageSerializer(),
        'default_filtering': 'collection'
    }

    fields.update({'collection': ChoiceSerializer(lang)})

    if hasattr(model, 'sizes'):
        fields.update({'sizes': SizeSerializer(many=True)})

    serializer = type(model.get_name() + 'Serializer', (ProductListSerializer, ), fields)

    return serializer


def create_detailed_serializer(model, lang):
    class Meta:
        exclude = ['id', 'category']
        depth = 1
        
    setattr(Meta, 'model', model)

    fields = {
        'Meta': Meta,
        'shortcut': ImageSerializer(),
        'images': ImageSerializer(many=True),
        'videos': VideoSerializer(many=True)
    }

    for prop in manager.get_all_props(model.get_name()):
        many = models.has_multiple_rels(model, prop)
        serializer = ChoiceSerializer(lang, many=many)

        if prop == 'rigidity':
            fields.update({prop + '1': serializer})
            fields.update({prop + '2': serializer})
        else:
            fields.update({prop: serializer})

    if hasattr(model, 'sizes'):
        fields.update({'sizes': SizeSerializer(many=True)})

    serializer = type(model.get_name() + 'Serializer', (ProductSerializer, ), fields)

    return serializer