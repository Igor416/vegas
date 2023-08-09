from . import models, LangDetectiveSerializer
from .choice import ChoiceSerializer

class StockSerializer(LangDetectiveSerializer):
  class Meta:
    exclude = ['id', 'collections', 'sizes']
    model = models.Stock

  def to_representation(self, obj):
    r = super().to_representation(obj)
    r['collections'] = ChoiceSerializer(instance=obj.collections.all(), lang=self.lang, many=True).data
    return self.extract_lang('desc', r)