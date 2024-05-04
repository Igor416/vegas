from rest_framework.serializers import SerializerMethodField
from api import catalog as ct
from api.translations import get_lang
from .product import ProductSerializer

class ListedProductsSerializer(ProductSerializer):
  desc = SerializerMethodField()
  default_filtering = ''

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
        'price': {'EUR': 0, 'MDL': 0, 'RON': 0, 'USD': 0},
        'discount': 0,
        'on_sale': False,
      }
    finally:
      del r['sizes']
    r['default_filtering'] = r.pop(self.default_filtering, '')
    if not r['name']:
      r['name'] = f'{ct.get_pr_trans("BedSheets", get_lang(self.lang), False)} ({r["name_" + self.lang]})'
    return r