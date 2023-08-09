from . import models, LangDetectiveSerializer

class TechnologySerializer(LangDetectiveSerializer):
  class Meta:
    exclude = ['id']
    model = models.Technology

  class MetaLayer:
    fields = ['technologies', 'name_en', 'name_ru', 'name_ro', 'image', 'desc_en', 'desc_ru', 'desc_ro']
    model = models.Technology

  def to_representation(self, obj):
    r = super().to_representation(obj)
    r['image'] = obj.get_absolute_url()
    return self.extract_lang('desc', self.extract_lang('name', r))