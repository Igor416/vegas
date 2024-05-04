from api import catalog as ct
from .product import ProductManager

class BlanketManager(ProductManager):
  def get_by_type(self, type):
    if type == 'children':
      return self.all()

    types = {
      'Blankets Bamboo': 'Bamboo',
      'SumWin Blanket': 'SumWin',
      'Blankets with Sheep\'s Wool': 'Sheep',
      'Blankets with Thermoregulation': 'YETI'
    }

    queryset = self.none()

    for obj in self.all():
      if obj.name.startswith(types[type]):
        queryset |= self.filter(name=obj.name)

    return queryset