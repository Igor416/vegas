from api import catalog as ct
from .product import ProductManager

class BedManager(ProductManager):
  def get_by_type(self, type):
    if type == 'All beds':
      queryset = self.all()
  
    elif 'children' in type:
      queryset = self.none()
      objs = {'Chris', 'Alice', 'Mari'}

      for obj in objs:
        queryset |= self.filter(name=obj)

      return queryset

    else:
      types = {
      'Wooden beds': 'Wood',
      'Beds with soft upholstery': 'Soft Upholstery',
      }
      queryset = self.filter(bed_type=self.get_prop(ct.BED_TYPE, types[type]))

    return queryset