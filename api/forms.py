from django import forms
from . import models

class ProductForm(forms.ModelForm):
    class Meta:
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(ProductForm, self).__init__(*args, **kwargs)
        for field in self.fields.values():
            if hasattr(field, 'queryset'):
                if field.label == 'Категория':
                    field.initial = models.Category.objects.get(name=self.model.__name__)
                    print(field.initial, self.model.__name__)
                    field.disabled = True
                    continue
                elif field.label == 'Размеры':
                    field.queryset = models.Size.objects.all()
                    continue
                field.queryset = models.Choice.objects.filter(name=field.label)
        setattr(self.Meta, 'model', self.model)
