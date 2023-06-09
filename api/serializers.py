from rest_framework.serializers import ModelSerializer, SerializerMethodField
from . import models
from .base_serializers import LangDetectiveSerializer, PriceSerializer, FileSerializer
from .catalog import Manager
from .translations import get_lang

manager = Manager()

class MattressColectionsPriceSerializer(PriceSerializer):
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

        return {
            obj.property_en: self.extract_price({'priceEUR': size.priceEUR})
        }

class CategorySerializer(LangDetectiveSerializer):
    class Meta:
        fields = '__all__'
        model = models.Category

    def get_default_filtering(self, obj):
        return manager.get_default_filtering(obj.name)

    def get_default_filtering_lang(self, obj):
        return manager.get_prop_trans(self.get_default_filtering(obj), get_lang(self.lang))

    def to_representation(self, obj):
        r = {
            'name': obj.name,
            'name_s': getattr(obj, f'name_{self.lang}_s'),
            'name_pl': getattr(obj, f'name_{self.lang}_pl'),
        }
        
        if obj.name != 'Basis':
            r.update({
                'default_filtering': self.get_default_filtering(obj),
                'default_filtering_lang': self.get_default_filtering_lang(obj)
            })
        return r
    
class ChoiceSerializer(LangDetectiveSerializer):
    class Meta:
        exclude = ['name', 'category']
        model = models.Choice

    def to_representation(self, obj):
        return getattr(obj, 'property_' + self.lang)

class TechnologySerializer(LangDetectiveSerializer):
    class Meta:
        exclude = ['id']
        model = models.Technology

    class MetaLayer:
        fields = ['technologies', 'name_en', 'name_ru', 'name_ro', 'image', 'desc_en', 'desc_ru', 'desc_ro']
        model = models.Technology

    def to_representation(self, obj):
        r = super().to_representation(obj)
        r['image'] = obj.get_absolute_url()
        return self.extract_lang('desc', self.extract_lang('name', r))

class SizeSerializer(PriceSerializer):
    class Meta:
        exclude = ['id', 'category', 'product']
        model = models.Size
        
    def to_representation(self, instance):
        return self.extract_price(super().to_representation(instance))

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

class MarkerSerializer(LangDetectiveSerializer):
    class Meta:
        fields = ['name']
        model = models.Marker

    def to_representation(self, obj):
        if obj.name.startswith('rigidity_'):
            return f'/media/markers/{obj.name}_{self.lang}.jpg'
        return f'/media/markers/{obj.name}.jpg'

class BedSheetsSizeSerializer(ModelSerializer):
    duvet_cover_size = SizeSerializer('MD')
    sheet_size = SizeSerializer('MD')
    elasticated_sheet_size = SizeSerializer('MD')
    pillowcase_sizes = SizeSerializer('MD', many=True)

    class Meta:
        exclude = ['id', 'category', 'product']
        model = models.Size

class ProductSerializer(LangDetectiveSerializer, PriceSerializer):
    shortcut = ImageSerializer()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['sizes'] = SizeSerializer(country=self.country, many=True)
        self.fields['category'] = CategorySerializer(lang=self.lang)

    def to_representation(self, obj):
        r = super().to_representation(obj)
        r['sizes'] = sorted(
            sorted(r['sizes'], key=lambda size: size['price']['EUR'] * (100 - size['discount']) / 100),
            key=lambda size: size['on_sale'],
            reverse=True
        )
        return r

class BestProductSerializer(ProductSerializer):
    def to_representation(self, obj):
        r = super().to_representation(obj)
        r['category'] = obj.category.name
        r['size'] = r['sizes'][0]
        del r['sizes']
        try:
            r['category_name'] = getattr(obj.category, f'name_{self.lang}_s')
        except:
            r['category_name'] = obj.category.name_en_s
        return r

class ListedProductsSerializer(ProductSerializer):
    desc = SerializerMethodField()

    def get_desc(self, obj):
        shortened, symbols, words = '', 288, 0
        for sent in getattr(obj, 'desc_' + self.lang).split('.'):
            words += len(sent.strip())
            if words <= symbols:
                shortened += sent + '. '
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
                "price": {
                    "EUR": 0,
                    "MDL": 0,
                    "RON": 0,
                    "USD": 0
                },
                "discount": 0,
                "on_sale": False,
            }
        finally:
            del r['sizes']
        r['default_filtering'] = r.pop(self.default_filtering)
        if not r['name']:
            r['name'] = f"{manager.get_pr_trans('BedSheets', get_lang(self.lang), False)} ({r['name_' + self.lang]})"
        return r

class DetailedProductSerializer(ProductSerializer):
    images = ImageSerializer(many=True)
    videos = VideoSerializer(many=True)

    def to_representation(self, obj):
        r = super().to_representation(obj)
        
        r['characteristic'], r['description'] = {}, {}
        order = manager.get_order(obj.get_name())
        for key in order[1]:
            if key.startswith('rigidity'):
                key_lang = manager.get_prop_trans(key[:-1], get_lang(self.lang)) + f' {key[-1]}'
            else:
                key_lang = manager.get_prop_trans(key, get_lang(self.lang))
            
            r['characteristic'][key_lang] = r[key] if key.startswith('extra') else r.pop(key)

            if key in order[0]:
                r['description'][key_lang] = r['characteristic'][key_lang]

        for size in [*r['sizes']]:
            if size['length'] == 200:
                new_size = size.copy()
                new_size['length'] = 190
                r['sizes'].append(new_size)
        if isinstance(obj, models.BedSheets):
            r = self.extract_lang('name', r)
        return self.extract_lang('desc', r)

class StockSerializer(LangDetectiveSerializer):
    class Meta:
        exclude = ['id', 'collections', 'sizes']
        model = models.Stock

    def to_representation(self, obj):
        r = super().to_representation(obj)
        r['collections'] = ChoiceSerializer(instance=obj.collections.all(), lang=self.lang, many=True).data
        return self.extract_lang('desc', r)