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
				field.queryset = models.Size.objects.filter(category=None, priceEUR=0)