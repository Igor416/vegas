from api import models, catalog as ct
from api.translations import get_lang
from api.serializers.files import ImageSerializer, VideoSerializer
from .product import ProductSerializer

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