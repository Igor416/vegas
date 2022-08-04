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

        for name, field in self.fields.items():
            if hasattr(field, 'queryset'):
                if name == 'category':
                    field.initial = models.Category.objects.get(name=self.model.get_name())
                    field.disabled = True

                elif name == 'sizes':
                    field.queryset = models.Size.objects.all()

                elif name == 'shortcut':
                    filtered = filter(lambda i: i.is_shortcut(), images)
                    field.queryset = models.Image.objects.filter(pk__in=[item.pk for item in filtered])

                elif name == 'images':
                    filtered = filter(lambda i: not i.is_shortcut(), images)
                    field.queryset = models.Image.objects.filter(pk__in=[item.pk for item in filtered])

                elif name == 'videos':
                    field.queryset = models.Video.objects.all()

                elif name.startswith('rigidity'):
                    field.label = manager.get_prop_trans(name[:-1], RU) + ' ' + name[-1]
                    field.queryset = models.Choice.objects.filter(name=name[:-1])

                elif name not in ['recomended', 'structure', 'technologies']:
                    field.label = manager.get_prop_trans(name, RU)
                    field.queryset = models.Choice.objects.filter(name=name)

            else:
                try:
                    field.label = manager.get_prop_trans(name, RU)
                except:
                    pass

        setattr(self.Meta, 'model', self.model)