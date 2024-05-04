from .product import ProductSerializer

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