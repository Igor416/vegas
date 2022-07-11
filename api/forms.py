from django import forms
from . import models
from .catalog import Manager

manager = Manager()

class ProductForm(forms.ModelForm):
    class Meta:
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(ProductForm, self).__init__(*args, **kwargs)
        for name, field in self.fields.items():
            if hasattr(field, 'queryset'):
                if name == 'category':
                    field.initial = models.Category.objects.get(name=self.model.get_name())
                    field.disabled = True
                    continue
                elif name == 'sizes':
                    field.queryset = models.Size.objects.all()
                    continue
                elif name.startswith('rigidity'):
                    field.queryset = models.Choice.objects.filter(name=name[:-1])
                    field.label = manager.get_prop_trans(name[:-1]) + ' ' + name[-1]
                    continue
                elif name != 'recomended':
                    field.label = manager.get_prop_trans(name)
                field.queryset = models.Choice.objects.filter(name=name)
        setattr(self.Meta, 'model', self.model)
