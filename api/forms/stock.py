from django import forms
from datetime import date
from api import models

class StockForm(forms.ModelForm):
	class Meta:
		fields = '__all__'
		model = models.Stock

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		today = date.today()
		self.fields['expiry'].initial = date(today.year, 1 if today.month == 12 else today.month + 1, 1)
		self.fields['collections'].queryset = models.Choice.objects.filter(name='collection')
		self.fields['sizes'].queryset = models.Size.objects.filter(priceEUR=0, discount__gt=0)
