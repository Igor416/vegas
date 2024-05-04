from django import forms
from api import models
from api import catalog as ct

class ProductForm(forms.ModelForm):
	model = models.products.Product
  
	class Meta:
		fields = '__all__'

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		images = models.Image.objects.all()
		try:
			image_name = self.instance.name_en.replace(' ', '_')
		except AttributeError:
			image_name = self.instance.name.replace(' ', '_')

		for name, field in self.fields.items():
			if hasattr(field, 'queryset'):
				if name == 'category':
					field.initial = models.Category.objects.get(name=self.model.get_name())
					field.disabled = True

				elif name == 'sizes':
					category = models.Category.objects.get(name=self.model.get_name())
					by_category = models.Size.objects.filter(category=category, product=self.instance.name)
					field.queryset = by_category | models.Size.objects.filter(category=None, priceEUR__gt=0)

				elif name == 'shortcut':
					filtered = filter(lambda i: i.is_shortcut(), images)
					field.queryset = images.filter(pk__in=[item.pk for item in filtered], image__endswith=image_name + '.jpg')

				elif name == 'images':
					filtered = filter(lambda i: not i.is_shortcut(), images)
					field.queryset = images.filter(pk__in=[item.pk for item in filtered], image__contains=image_name + '_')

				elif name == 'videos':
					field.queryset = models.Video.objects.filter(image__contains=self.instance.name)

				elif name == 'visible_markers':
					field.queryset = models.Marker.objects.filter(name__in=['3_zones', 'garanty', 'rolled'])

				elif name.startswith('rigidity'):
					field.label = ct.get_prop_trans(name[:-1]) + ' ' + name[-1]
					field.queryset = models.Choice.objects.filter(name=name[:-1])

				elif name in ['technologies', 'structure']:
					field.queryset = models.Technology.objects.filter(isTechnology=name == 'technologies')

				elif name == 'recomended':
					field.queryset = models.Choice.objects.filter(name='collection')

				else:
					field.label = ct.get_prop_trans(name)
					field.queryset = models.Choice.objects.filter(name=name)

			else:
				try:
					field.label = ct.get_prop_trans(name)
				except:
					pass

		setattr(self.Meta, 'model', self.model)