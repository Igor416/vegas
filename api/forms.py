from django import forms
from . import models
from .catalog import Manager
from .translations import RU

manager = Manager()

class ProductForm(forms.ModelForm):
    class Meta:
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(ProductForm, self).__init__(*args, **kwargs)
        images = models.Image.objects.all()
        try:
            image_name = self.instance.name_en.replace(' ', '_')
        except (AttributeError):
            image_name = self.instance.name.replace(' ', '_')

        for name, field in self.fields.items():
            if hasattr(field, 'queryset'):
                if name == 'category':
                    field.initial = models.Category.objects.get(name=self.model.get_name())
                    field.disabled = True

                elif name == 'sizes':
                    category = models.Category.objects.get(name=self.model.get_name())
                    by_category = models.Size.objects.filter(category=category, product=self.instance.name) 
                    field.queryset = by_category | models.Size.objects.filter(category=None, priceMDL__gt=0)

                elif name == 'shortcut':
                    filtered = filter(lambda i: i.is_shortcut(), images)
                    try:
                        field.queryset = images.filter(pk__in=[item.pk for item in filtered], image__endswith=image_name + '.jpg')
                    except (TypeError, ValueError):
                        field.queryset = images.filter(pk__in=[item.pk for item in filtered], image__endswith=image_name + '.jpg')
                       
                elif name == 'images':
                    filtered = filter(lambda i: not i.is_shortcut(), images)
                    try:
                        field.queryset = images.filter(pk__in=[item.pk for item in filtered], image__contains=image_name + '_')
                    except (TypeError, ValueError):
                        field.queryset = images.filter(pk__in=[item.pk for item in filtered], image__contains=image_name + '_')

                elif name == 'videos':
                    try:
                        field.queryset = models.Video.objects.filter(image__contains=self.instance.name)
                    except (TypeError, ValueError):
                        field.queryset = models.Video.objects.none()

                elif name == 'visible_markers':
                    field.queryset = models.Marker.objects.filter(name__in=['3_zones', 'garanty', 'rolled'])

                elif name.startswith('rigidity'):
                    field.label = manager.get_prop_trans(name[:-1], RU) + ' ' + name[-1]
                    field.queryset = models.Choice.objects.filter(name=name[:-1])

                elif name == 'technologies':
                    field.queryset = models.Technology.objects.filter(isTechnology=True)

                elif name == 'structure':
                    field.queryset = models.Technology.objects.filter(isTechnology=False)

                elif name == 'recomended':
                    field.queryset = models.Choice.objects.filter(name='collection')

                else:
                    field.label = manager.get_prop_trans(name, RU)
                    field.queryset = models.Choice.objects.filter(name=name)

            else:
                try:
                    field.label = manager.get_prop_trans(name, RU)
                except:
                    pass

        setattr(self.Meta, 'model', self.model)

class BedSheetsSizesForm(forms.ModelForm):
    class Meta:
        fields = '__all__'
        model = models.BedSheetsSize

    def __init__(self, *args, **kwargs):
        super(BedSheetsSizesForm, self).__init__(*args, **kwargs)
        for name, field in self.fields.items():
            if hasattr(field, 'queryset'):
                if name not in ['category', 'product']:
                    category = models.Category.objects.get(name=models.BedSheets.get_name())
                    by_category = models.Size.objects.filter(category=category) 
                    field.queryset = by_category | models.Size.objects.filter(category=None, priceMDL__gt=0)
