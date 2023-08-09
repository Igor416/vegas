from rest_framework.serializers import SerializerMethodField
from . import models, catalog as ct, get_lang, LangDetectiveSerializer, PriceSerializer
from .category import CategorySerializer
from .size import SizeSerializer
from .files import ImageSerializer, VideoSerializer

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
                'width': 0,
                'length': 0,
                'price': {
                    'EUR': 0,
                    'MDL': 0,
                    'RON': 0,
                    'USD': 0
                },
                'discount': 0,
                'on_sale': False,
            }
        finally:
            del r['sizes']
        r['default_filtering'] = r.pop(self.default_filtering)
        if not r['name']:
            r['name'] = f'{ct.get_pr_trans("BedSheets", get_lang(self.lang), False)} ({r["name_" + self.lang]})'
        return r

class DetailedProductSerializer(ProductSerializer):
    images = ImageSerializer(many=True)
    videos = VideoSerializer(many=True)

    def to_representation(self, obj):
        r = super().to_representation(obj)
        
        r['characteristic'], r['description'] = {}, {}
        order = ct.get_order(obj.get_name())
        for key in order[1]:
            if key.startswith('rigidity'):
                key_lang = ct.get_prop_trans(key[:-1], get_lang(self.lang)) + f' {key[-1]}'
            else:
                key_lang = ct.get_prop_trans(key, get_lang(self.lang))
            
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