from api import catalog as ct
from .product import ProductManager

class BasisManager(ProductManager):
  def get_by_type(self, type):
    return self.filter(name=type)