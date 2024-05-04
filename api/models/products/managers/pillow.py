from api import catalog as ct
from .product import ProductManager
  
class PillowManager(ProductManager):
  def get_by_types_and_forms(self, filter):
    queryset = self.none()

    if filter == 'Classic form':
      objs = {'9', '14', '16', '19', '20', 'Junior', 'Bimbo', 'Latex Royal', 'Extra Memory'}
      
    elif filter == 'Ergonomic form with rollers':
      objs = {'8', '11', '17', '21'}

    elif filter == 'Pillows for pregnants':
      objs = {'Baby Boom'}

    elif filter == 'Others':
      objs = {'Sleep Constructor', 'Beauty'}

    for obj in objs:
      queryset |= self.filter(name=obj)

    return queryset

  def get_by_materials(self, filter):
    if filter == 'With latex':
      material_filler = self.get_prop(ct.MATERIAL_FILLER, 'Latex Monolith')
      
    elif filter == 'Made from foam with memory effect Memory Foam':
      material_filler = self.get_prop(ct.MATERIAL_FILLER, 'MemoryFoam Slices')

    elif filter == 'Pillows with cooling gel':
      material_filler = self.get_prop(ct.MATERIAL_FILLER, 'Cooling Gel')

    return self.filter(material_filler=material_filler)

  def get_by_age(self, filter):
    age = self.get_prop(ct.AGE, filter.replace('Pillows for ', ''))
    return self.filter(age=age)

  def get_by_type(self, type):
    if type == 'children':
      queryset = self.get_by_age('children')

    return queryset

  def get_by_special(self, filter):
    if filter == 'Pillow Beauty for beauty and youngness':
      name = 'Beauty'
      
    elif filter == 'Pillow Baby Boom for pregnants and breastfeeding':
      name = 'Baby Boom'

    elif filter == 'Pillow Travel for trips':
      name = 'Travel'

    return self.filter(name=name)