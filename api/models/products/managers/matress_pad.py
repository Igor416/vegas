from api import catalog as ct
from .product import ProductManager

class MattressPadManager(ProductManager):
  def get_by_type(self, type):
    return self.filter(mattresspad_type=self.get_prop(ct.MATTRESSPAD_TYPE, type))

  def get_by_children(self, filter):
    return self.filter(name='Stressfree Frotte L4')