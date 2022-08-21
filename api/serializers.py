from rest_framework.serializers import ModelSerializer, SerializerMethodField, CharField
from . import models
from .catalog import Manager

manager = Manager()

langs = ['en', 'ru', 'ro']

class CategorySerializer(ModelSerializer):
    class Meta:
        exclude = ['id', 'name']
        model = models.Category

    def __init__(self, *args, **kwargs):
        super(CategorySerializer, self).__init__(*args, **kwargs)
        self.lang = kwargs['context']['request'].GET.get('lang')

    def get_default_filtering(self, obj):
        return manager.get_default_filtering(obj.name)

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

class TechnologySerializer(ModelSerializer):
    class Meta:
        exclude = ['id']
        model = models.Technology

    class MetaLayer:
        fields = ['technologies', 'name_en', 'name_ru', 'name_ro', 'image', 'desc_en', 'desc_ru', 'desc_ro']
        model = models.Technology

    def __init__(self, lang, *args, **kwargs):
        super(TechnologySerializer, self).__init__(*args, **kwargs)
        self.lang = lang

    def to_representation(self, obj):
        r = super(TechnologySerializer, self).to_representation(obj)
        for lang in langs:
            if lang == self.lang:
                r.update({
                    'name': r.pop('name_' + lang),
                    'desc': r.pop('desc_' + lang),
                })
                continue
            r.pop('name_' + lang)
            r.pop('desc_' + lang)

        return r

class LayerSerializer(ModelSerializer):
    def to_representation(self, obj):
        return obj.quantity

class LayerMattressSerializer(TechnologySerializer):
    technologies = LayerSerializer(source='layermattress_set', many=True)

    class Meta(TechnologySerializer.MetaLayer): pass
        
class LayerPillowSerializer(TechnologySerializer):
    technologies = LayerSerializer(source='layerpillow_set', many=True)

    class Meta(TechnologySerializer.MetaLayer): pass

class LayerMattressPadSerializer(TechnologySerializer):
    technologies = LayerSerializer(source='layermattresspad_set', many=True)
    
    class Meta(TechnologySerializer.MetaLayer): pass

class SizeSerializer(ModelSerializer):
    class Meta:
        exclude = ['id', 'category']
        model = models.Size

class FileSerializer(ModelSerializer):
    def to_representation(self, obj):
        return obj.get_absolute_url()

    class Meta:
        fields = ['image']

class ImageSerializer(FileSerializer):
    class Meta(FileSerializer.Meta):
        model = models.Image

class VideoSerializer(FileSerializer):
    class Meta(FileSerializer.Meta):
        model = models.Video

class RecomendedSerializer(ModelSerializer):
    class Meta:
        fields = ['name']
        model = models.Basis

class MarkerSerializer(ModelSerializer):
    class Meta:
        fields = ['name']
        model = models.Marker

    def __init__(self, lang, *args, **kwargs):
        super(MarkerSerializer, self).__init__(*args, **kwargs)
        self.lang = lang

    def to_representation(self, obj):
        return f'/media/markers/{obj.name}_{self.lang}.jpg'

class ProductSerializer(ModelSerializer):
    shortcut = ImageSerializer()
    sizes = SizeSerializer(many=True)

def create_best_product_serializer(model):
    class Meta:
        fields = ['id', 'shortcut', 'name', 'sizes', 'discount']

    def to_representation(self, obj):
        r = super(ProductSerializer, self).to_representation(obj)
        r['category'] = obj.category.name
        return r

    setattr(Meta, 'model', model)

    return type(model.get_name() + 'Serializer', (ProductSerializer, ), {'Meta': Meta, 'to_representation': to_representation})

class ProductListSerializer(ProductSerializer):
    desc = SerializerMethodField()

    def get_desc(self, obj):
        shortened, symbols, words = '', 256, 0
        for sent in getattr(obj, 'desc_' + self.lang).split('.'):
            words += len(sent.strip())
            if words <= symbols:
                shortened += sent + '.'
            else:
                return shortened

def create_list_serializer(model, lang):
    class Meta:
        fields = ['id', 'name', 'discount', 'best', 'desc', 'sizes', 'shortcut', 'markers', manager.get_default_filtering(model.get_name())]
        depth = 1

    setattr(Meta, 'model', model)

    default_filtering = manager.get_default_filtering(model.get_name())
    many = models.has_multiple_rels(model, default_filtering)

    fields = {
        'Meta': Meta,
        'lang': lang,
        'markers': MarkerSerializer(lang, many=True),
        default_filtering: ChoiceSerializer(lang, many=many)
    }

    return type(model.get_name() + 'Serializer', (ProductListSerializer, ), fields)

class ProductDetailsSerializer(ProductSerializer):
    images = ImageSerializer(many=True)
    videos = VideoSerializer(many=True)

    def __init__(self, *args, **kwargs):
        super(ProductDetailsSerializer, self).__init__(*args, **kwargs)
        self.fields.update({'desc': self.fields.pop('desc_' + self.lang)})

    def to_representation(self, obj):
        r = super(ProductDetailsSerializer, self).to_representation(obj)

        r['characteristic'], r['description'] = {}, {}
        for key in self.model.get_order():
            if key.startswith('rigidity'):
                key_lang = manager.get_prop_trans(key[:-1], langs.index(self.lang)) + f' {key[-1]}'
            else:
                key_lang = manager.get_prop_trans(key, langs.index(self.lang))
            
            r['characteristic'][key_lang] = r.pop(key)

            if key in self.model.get_short_order():
                r['description'][key_lang] = r['characteristic'][key_lang]
        
        return r

def create_detail_serializer(model, lang):
    class Meta:
        exclude = ['category', 'visible_markers'] + ['desc_' + l for l in langs if l != lang]
        depth = 1
        
    setattr(Meta, 'model', model)

    fields = {
        'Meta': Meta,
        'lang': lang,
        'model': model
    }

    for prop in manager.get_all_props(model.get_name()):
        many = models.has_multiple_rels(model, prop)
        serializer = ChoiceSerializer(lang, many=many)
        
        if prop != 'rigidity':
            fields.update({prop: serializer})

    if model is models.Mattress:
        fields.update({'rigidity1': ChoiceSerializer(lang)})
        fields.update({'rigidity2': ChoiceSerializer(lang)})
        
        fields.update({'structure': LayerMattressSerializer(lang, many=True)})
        fields.update({'technologies': TechnologySerializer(lang, many=True)})

        fields.update({'markers': MarkerSerializer(lang, many=True)})

    elif model is models.Pillow:
        fields.update({'structure': LayerPillowSerializer(lang, many=True)})

    elif model is models.MattressPad:
        fields.update({'structure': LayerMattressPadSerializer(lang, many=True)})
        fields.update({'technologies': TechnologySerializer(lang, many=True)})

    return type(model.get_name() + 'Serializer', (ProductDetailsSerializer, ), fields)