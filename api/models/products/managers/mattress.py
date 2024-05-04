from api import catalog as ct
from .product import ProductManager

class MattressManager(ProductManager):
  def get_by_collection(self, filter):
    filter = filter.replace('Mattresses ', '') #'Матрасы Modern' -> 'Modern'
    collection = self.get_prop(ct.COLLECTION, filter)
    return self.filter(collection=collection)

  def get_by_springless(self, filter):
    queryset = self.filter(springs=0)
    if filter == 'Mattresses with latex':
      collection = self.get_prop(ct.COLLECTION, 'Ecolatex')
      queryset = queryset.filter(collection=collection)
      queryset |= self.filter(name='Cocolatex')
    return queryset

  def get_by_springblock(self, filter):
    type = self.get_prop(ct.MATTRESS_TYPE, filter)
    return self.filter(mattress_type=type)
    
  def get_by_age(self, filter):
    age = self.get_prop(ct.AGE, filter.replace('Mattresses for ', ''))
    return self.filter(age=age)

  def get_by_children(self, filter):
    queryset = self.get_by_age('children')
    springless = self.get_by_springless(None)
    if filter == 'With springs':
      queryset = queryset.difference(springless)
    elif filter == 'Springless':
      queryset = springless

    return queryset

  def get_by_rigidity(self, filter):
    RIGIDITIES = {
      'Hard mattresses': 'firm',
      'Medium firm mattresses': 'semifirm',
      'Soft mattresses': 'semisoft'
    }

    if filter in list(RIGIDITIES.keys()):
      rigidity1 = self.get_prop(ct.RIGIDITY, RIGIDITIES[filter])
      rigidity2 = self.get_prop(ct.RIGIDITY, RIGIDITIES[filter])

      queryset = self.filter(rigidity1=rigidity1)
      queryset |= self.filter(rigidity2=rigidity2)

    elif filter == 'Non-symmetrical Mattresses':
      queryset = self.none()
      for rigidity1 in self.get_props(ct.RIGIDITY):
        for obj in self.filter(rigidity1=rigidity1):
          if obj.rigidity2 is None:
            continue
          elif obj.rigidity2.property_en == rigidity1.property_en:
            queryset |= self.filter(name=obj.name)
    else:
      if filter == 'Mattresses with latex':
        objs = {'F2', 'F5', 'M1', 'M3', 'M4', 'M5', 'X2', 'X3', 'X4', 'X6', 'X7', 'X8'}
        queryset = self.get_by_springless(filter)
      
      elif filter == 'Mattresses with coconut coir':
        objs = {'F1', 'F3', 'F5', 'M3', 'M4', 'X5', 'X6', 'X7', 'L2', 'L3', 'L6'}
        queryset = self.get_by_collection('Vegas Kids')

      elif filter == 'Mattresses with memory effect':
        objs = {'F6', 'M2', 'X1', 'A5'}
        queryset = self.none()

      for obj in objs:
        queryset |= self.filter(name=obj)

    return queryset
  