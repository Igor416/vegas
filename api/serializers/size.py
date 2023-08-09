from . import models, PriceSerializer

class SizeSerializer(PriceSerializer):
  class Meta:
    exclude = ['id', 'category', 'product']
    model = models.Size
    
  def to_representation(self, instance):
    return self.extract_price(super().to_representation(instance))

class BedSheetsSizeSerializer(SizeSerializer):
  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    self.fields['duvet_cover_size'] = SizeSerializer(country=self.country)
    self.fields['sheet_size'] = SizeSerializer(country=self.country)
    self.fields['elasticated_sheet_size'] = SizeSerializer(country=self.country)
    self.fields['pillowcase_sizes'] = SizeSerializer(country=self.country, many=True)

  class Meta(SizeSerializer.Meta):
    model = models.BedSheetsSize