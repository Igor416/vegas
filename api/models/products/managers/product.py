from django.db.models import Manager
from api.models.choice import Choice

class ProductManager(Manager):
  def get_filtered(self, type, filter):
    if type == 'all':
      return self.all()

    if not filter:
      return self.get_by_type(type.replace('_', ' '))

    return getattr(self, 'get_by_' + type)(filter)

  def get_by_type(self, type):
    pass

  def get_by_name(self, name):
    return self.get(name=name)

  def get_props(self, name):
    return Choice.objects.filter(name=name)

  def get_prop(self, name, property):
    if len(property.split(' ')) > 1:
      return Choice.objects.get(name=name, property_en=property)
        
    return Choice.objects.get(name=name, property_en=property.title())