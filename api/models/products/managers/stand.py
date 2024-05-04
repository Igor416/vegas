from api import catalog as ct
from .product import ProductManager

class StandManager(ProductManager):
  def get_by_type(self, type):
    puffs = {'Vicont', 'Ludovic II', 'Ludovic I', 'Filip'}
    if type == 'Puffs':
      queryset = self.none()

      for obj in puffs:
        queryset |= self.filter(name=obj)

    else:
      types = {
      'Wooden stands': 'Tree Ash',
      'Stands with soft upholstery': 'Textile',
      }
      queryset = self.filter(material=self.get_prop(ct.MATERIAL, types[type])).exclude(name__in=puffs)

    return queryset