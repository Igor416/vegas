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

    def to_representation(self, obj):
        r = super(ProductDetailSerializer, self).to_representation(obj)
        characteristic = dict()
        
        for prop in manager.get_all_props(self.model.get_name()):
            if prop != 'rigidity':
                characteristic.update({prop: r.pop(prop)})
                
        if self.model == models.Mattress:
            characteristic.update({'rigidity1': r.pop('rigidity1')})
            characteristic.update({'rigidity2': r.pop('rigidity2')})

        for key, val in r.copy().items():
            if key == 'Characteristic':
                break
            elif key == 'best' or key == 'discount':
                continue
            elif isinstance(val, int) or isinstance(val, bool):
                characteristic.update({key: r.pop(key)})

        sorted_dict = {}
        for key in self.model.get_order():
            if key.startswith('rigidity'):
                sorted_dict[manager.get_prop_trans('rigidity', langs.index(self.lang)) + f' {key[-1]}'] = characteristic[key]
                continue
            sorted_dict[manager.get_prop_trans(key, langs.index(self.lang))] = characteristic[key]

        r['description'] = dict()
        for key in self.model.get_short_order():
            if key.startswith('rigidity'):
                key_lang = manager.get_prop_trans('rigidity', langs.index(self.lang)) + f' {key[-1]}'
                r['description'][key_lang] = sorted_dict[key_lang]
                continue
            key_lang = manager.get_prop_trans(key, langs.index(self.lang))
            r['description'][key_lang] = sorted_dict[key_lang]
            
        r['characteristic'] = sorted_dict
        

        return r

def create_list_serializer(model, lang):
    class Meta:
        fields = ['id', 'name', 'discount', 'best', 'desc_' + lang]
        fields += ['sizes', 'shortcut', manager.get_default_filtering(model.get_name())]
        depth = 1

    setattr(Meta, 'model', model)

    default_filtering = manager.get_default_filtering(model.get_name())
    many = models.has_multiple_rels(model, default_filtering)

    fields = {
        'Meta': Meta,
        'lang': lang,
        default_filtering: ChoiceSerializer(lang, many=many)
    }

    serializer = type(model.get_name() + 'Serializer', (ProductListSerializer, ), fields)

    return serializer

def create_detail_serializer(model, lang):
    class Meta:
        exclude = ['category'] + ['desc_' + l for l in langs if l != lang]
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

    if model == models.Mattress:
        fields.update({'rigidity1': ChoiceSerializer(lang)})
        fields.update({'rigidity2': ChoiceSerializer(lang)})
        
        fields.update({'structure': LayerMattressSerializer(lang, many=True)})
        fields.update({'technologies': TechnologySerializer(lang, many=True)})

    if model == models.Pillow:
        fields.update({'structure': LayerPillowSerializer(lang, many=True)})

    if model == models.MattressPad:
        fields.update({'structure': LayerMattressPadSerializer(lang, many=True)})
        fields.update({'technologies': TechnologySerializer(lang, many=True)})

    serializer = type(model.get_name() + 'Serializer', (ProductDetailSerializer, ), fields)

    return serializer