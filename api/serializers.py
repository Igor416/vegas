from django import shortcuts
from rest_framework.serializers import ModelSerializer, SerializerMethodField
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

    def get_default_filtering(self, obj):
        return getattr(models, obj.name).default_filtering

    def get_default_filtering_lang(self, obj):
        return manager.get_prop_trans(self.get_default_filtering(obj), langs.index(self.lang))

    def to_representation(self, obj):
        return {
            'name': obj.name,
            'name_s': getattr(obj, f'name_{self.lang}_s'),
            'name_pl': getattr(obj, f'name_{self.lang}_pl'),
            'default_filtering': self.get_default_filtering(obj),
            'default_filtering_lang': self.get_default_filtering_lang(obj),
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

class FileSerializer(ModelSerializer):
    def to_representation(self, obj):
        return obj.get_absolute_url()

class ImageSerializer(FileSerializer):
    class Meta:
        fields = ['image']
        model = models.Image

class VideoSerializer(FileSerializer):
    class Meta:
        fields = ['image']
        model = models.Video

class RecomendedSerializer(ModelSerializer):
    class Meta:
        fields = ['name']
        model = models.Basis

class ProductSerializer(ModelSerializer):
    shortcut = ImageSerializer()
    sizes = SizeSerializer(many=True)

    def __init__(self, *args, **kwargs):
        super(ProductSerializer, self).__init__(*args, **kwargs)

        self.fields.update({'desc': self.fields.pop('desc_' + self.lang)})

class ProductListSerializer(ProductSerializer):
    desc = SerializerMethodField()

    def get_desc(self, desc):
        shortened = ''

        symbols = 256
        words = 0
        for sent in desc.split('.'):
            words += len(sent.strip())
            if words <= symbols:
                shortened += sent + '.'
            else:
                return shortened.strip()

class ProductDetailSerializer(ProductSerializer):
    images = ImageSerializer(many=True)
    videos = VideoSerializer(many=True)

    def __init__(self, *args, **kwargs):
        super(ProductDetailSerializer, self).__init__(*args, **kwargs)

def create_list_serializer(model, lang):
    class Meta:
        fields = ['id', 'name', 'discount', 'best', 'desc_' + lang]
        fields += ['sizes', 'shortcut', model.default_filtering]
        depth = 1

    setattr(Meta, 'model', model)

    many = models.has_multiple_rels(model, model.default_filtering)

    fields = {
        'Meta': Meta,
        'lang': lang,
        model.default_filtering: ChoiceSerializer(lang, many=many)
    }

    serializer = type(model.get_name() + 'Serializer', (ProductListSerializer, ), fields)

    return serializer

def create_detail_serializer(model, lang):
    class Meta:
        exclude = ['id', 'category'] + ['desc_' + l for l in langs if l != lang]
        depth = 1
        
    setattr(Meta, 'model', model)

    fields = {
        'Meta': Meta,
        'lang': lang,
    }

    for prop in manager.get_all_props(model.get_name()):
        many = models.has_multiple_rels(model, prop)
        serializer = ChoiceSerializer(lang, many=many)

        if prop == 'rigidity':
            fields.update({prop + '1': serializer})
            fields.update({prop + '2': serializer})
        else:
            fields.update({prop: serializer})

    serializer = type(model.get_name() + 'Serializer', (ProductDetailSerializer, ), fields)

    return serializer