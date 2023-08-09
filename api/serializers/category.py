from . import models, catalog as ct, get_lang, LangDetectiveSerializer

class CategorySerializer(LangDetectiveSerializer):
  class Meta:
    fields = '__all__'
    model = models.Category

  def get_default_filtering(self, obj):
    return ct.get_default_filtering(obj.name)

  def get_default_filtering_lang(self, obj):
    return ct.get_prop_trans(self.get_default_filtering(obj), get_lang(self.lang))

  def to_representation(self, obj):
    r = {
      'name': obj.name,
      'name_s': getattr(obj, f'name_{self.lang}_s'),
      'name_pl': getattr(obj, f'name_{self.lang}_pl'),
    }
    
    if obj.name != 'Basis':
      r.update({
        'default_filtering': self.get_default_filtering(obj),
        'default_filtering_lang': self.get_default_filtering_lang(obj)
      })
    return r