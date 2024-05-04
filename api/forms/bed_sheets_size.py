from django import forms
from api import models

class BedSheetsSizeForm(forms.ModelForm):
	class Meta:
		fields = '__all__'
		model = models.BedSheetsSize

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		for name, field in self.fields.items():
			if hasattr(field, 'queryset'):
				if name not in ['category', 'product']:
					category = models.Category.objects.get(name=models.BedSheets.get_name())
					by_category = models.Size.objects.filter(category=category)
					field.queryset = by_category | models.Size.objects.filter(category=None, priceEUR__gt=0)