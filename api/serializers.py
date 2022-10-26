from rest_framework.serializers import ModelSerializer, SerializerMethodField
from . import models
from .catalog import Manager
from .translations import get_lang, langs

manager = Manager()

class MattressColectionsPriceSerializer(ModelSerializer):
    class Meta:
        fields = '__all__'
        model = models.Choice

    def to_representation(self, obj):
        size = None
        for m in models.Mattress.objects.filter(collection=obj):
            if size is None:
                size = m.sizes.first()
            elif not m.sizes.first() is None:
                if size.priceEUR > m.sizes.first().priceEUR:
                    size = m.sizes.first()

        r = {
            obj.property_en: {
                'priceMDL': size.priceMDL,
                'priceEUR': size.priceEUR,
            }
        }
        
        return r

class CategorySerializer(ModelSerializer):
    class Meta:
        fields = '__all__'
        model = models.Category

    def __init__(self, lang, *args, **kwargs):
        super(CategorySerializer, self).__init__(*args, **kwargs)
        self.lang = lang

    def get_default_filtering(self, obj):
        return manager.get_default_filtering(obj.name)

    def get_default_filtering_lang(self, obj):
        return manager.get_prop_trans(self.get_default_filtering(obj), get_lang(self.lang))

    def to_representation(self, obj):
        if isinstance(obj, models.Basis) or obj.name == 'Basis':
            return {
            'name': obj.name,
            'name_s': getattr(obj, f'name_{self.lang}_s'),
            'name_pl': getattr(obj, f'name_{self.lang}_pl'),
        }
        return {
            'name': obj.name,
            'name_s': getattr(obj, f'name_{self.lang}_s'),
            'name_pl': getattr(obj, f'name_{self.lang}_pl'),
            'default_filtering': self.get_default_filtering(obj),
            'default_filtering_lang': self.get_default_filtering_lang(obj)
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
        r['image'] = obj.get_absolute_url()
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

class SizeSerializer(ModelSerializer):
    class Meta:
        exclude = ['id', 'category', 'product']
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
        fields = ['property_en']
        model = models.Basis

    def to_representation(self, obj):
        return obj.property_en

class MarkerSerializer(ModelSerializer):
    class Meta:
        fields = ['name']
        model = models.Marker

    def __init__(self, lang, *args, **kwargs):
        super(MarkerSerializer, self).__init__(*args, **kwargs)
        self.lang = lang

    def to_representation(self, obj):
        if obj.name.startswith('rigidity_'):
            return f'/media/markers/{obj.name}_{self.lang}.jpg'
        return f'/media/markers/{obj.name}.jpg'

class BedSheetsSizeSerializer(ModelSerializer):
    duvet_cover_size = SizeSerializer()
    sheet_size = SizeSerializer()
    elasticated_sheet_size = SizeSerializer()
    pillowcase_sizes = SizeSerializer(many=True)

    class Meta:
        exclude = ['id', 'category', 'product']
        model = models.Size

class ProductSerializer(ModelSerializer):
    shortcut = ImageSerializer()
    sizes = SizeSerializer(many=True)

    def to_representation(self, obj):
        r = super(ProductSerializer, self).to_representation(obj)
        r['sizes'] = sorted(
            sorted(r['sizes'], key=lambda size: size['priceEUR'] * (100 - size['discount']) / 100),
            key=lambda size: size['on_sale'],
            reverse=True
        )
        return r

class ProductBestSerializer(ProductSerializer):
    def to_representation(self, obj):
        r = super(ProductBestSerializer, self).to_representation(obj)
        r['category'] = obj.category.name
        r['size'] = r['sizes'][0]
        del r['sizes']
        r['category_name'] = getattr(obj.category, f'name_{self.lang}_s')
        return r

def create_best_product_serializer(model, lang):
    class Meta:
        fields = ['id', 'shortcut', 'name', 'sizes', 'discount']

    setattr(Meta, 'model', model)
    return type(model.get_name() + 'Serializer', (ProductBestSerializer, ), {'Meta': Meta, 'lang': lang})

class ProductListSerializer(ProductSerializer):
    desc = SerializerMethodField()

    def get_desc(self, obj):
        shortened, symbols, words = '', 288, 0
        for sent in getattr(obj, 'desc_' + self.lang).split('.'):
            words += len(sent.strip())
            if words <= symbols:
                shortened += sent + '.'
            else:
                return shortened
        else:
            return getattr(obj, 'desc_' + self.lang)

    def to_representation(self, obj):
        r = super().to_representation(obj)
        try:
            r['size'] = r['sizes'][0]
        except:
            r['size'] = {
                "width": 0,
                "length": 0,
                "priceEUR": 0,
                "priceMDL": 0,
                "discount": 0,
                "on_sale": False,
            }
        finally:
            del r['sizes']
        if not r['name']:
            r['name'] = f"{manager.get_pr_trans('BedSheets', get_lang(self.lang), False)} ({r['name_' + self.lang]})"
        return r

def create_list_serializer(model, lang):
    class Meta:
        fields = ['id', 'name', 'discount', 'best', 'desc', 'sizes', 'shortcut'] + ([] if model is models.Basis else [manager.get_default_filtering(model.get_name())]) + (['markers'] if model is models.Mattress else []) + (['name_' + lang] if model is models.BedSheets else [])
        depth = 1
    
    setattr(Meta, 'model', model)
    default_filtering = manager.get_default_filtering(model.get_name())
    if model is models.Basis:
        many = False
    else:
        many = models.has_multiple_rels(model, default_filtering)

    fields = {
        'Meta': Meta,
        'lang': lang,
        default_filtering: ChoiceSerializer(lang, many=many)
    }
 
    if model is models.Mattress:
        fields.update({'markers': MarkerSerializer(lang, many=True)})
    elif model is models.Basis:
        del fields[default_filtering]

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
                key_lang = manager.get_prop_trans(key[:-1], get_lang(self.lang)) + f' {key[-1]}'
            else:
                key_lang = manager.get_prop_trans(key, get_lang(self.lang))
            
            if key.startswith('extra'):
                r['characteristic'][key_lang] = r[key]
            else:
                r['characteristic'][key_lang] = r.pop(key)

            if key in self.model.get_short_order():
                r['description'][key_lang] = r['characteristic'][key_lang]

        return r

def create_detail_serializer(model, lang):
    class Meta:
        exclude = ['category'] + ['desc_' + l for l in langs if l != lang] + (['visible_markers'] if model is models.Mattress else [])
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
        
        fields.update({'structure': TechnologySerializer(lang, many=True)})
        fields.update({'technologies': TechnologySerializer(lang, many=True)})

        fields.update({'markers': MarkerSerializer(lang, many=True)})

    elif model is models.Pillow:
        fields.update({'structure': TechnologySerializer(lang, many=True)})

    elif model is models.MattressPad:
        fields.update({'structure': TechnologySerializer(lang, many=True)})
        fields.update({'technologies': TechnologySerializer(lang, many=True)})

    elif model is models.BedSheets:
        fields.update({'sizes': BedSheetsSizeSerializer(lang, many=True)})

    elif model is models.Basis:
        fields.update({'recomended': RecomendedSerializer(many=True)})

    return type(model.get_name() + 'Serializer', (ProductDetailsSerializer, ), fields)

class StockSerializer(ModelSerializer):
    class Meta:
        exclude = ['id', 'collections', 'sizes']
        model = models.Stock

    def __init__(self, lang, *args, **kwargs):
        super(StockSerializer, self).__init__(*args, **kwargs)
        self.lang = lang

    def to_representation(self, obj):
        r = super(StockSerializer, self).to_representation(obj)
        r['desc'] = r['desc_' + self.lang]
        for lang in langs:
            del r['desc_' + lang]
        r['collections'] = ChoiceSerializer(instance=obj.collections.all(), lang=self.lang, many=True).data
        
        return r