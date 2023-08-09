from . import models, LangDetectiveSerializer

class MarkerSerializer(LangDetectiveSerializer):
  class Meta:
    fields = ['name']
    model = models.Marker

  def to_representation(self, obj):
    if obj.name.startswith('rigidity_'):
      return f'/media/markers/{obj.name}_{self.lang}.jpg'
    return f'/media/markers/{obj.name}.jpg'