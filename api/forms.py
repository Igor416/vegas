from django import forms
from . import models

class ChoiceForm(forms.ModelForm):
    class Meta:
        model = models.Choice
        exclude = ['category']

class ProductForm(forms.ModelForm):
    def __init__(self, name, *args, **kwargs):
        super(ProductForm, self).__init__(*args, **kwargs)
        for field in self.fields.values():
            if hasattr(field, 'queryset'):
                if field.label == 'Категория':
                    field.initial = models.Category.objects.get(name=name)
                    field.disabled = True
                    continue
                field.queryset = models.Choice.objects.filter(name=field.label)

class MattrassForm(ProductForm):
    class Meta:
        model = models.Mattrass
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(MattrassForm, self).__init__("Матрас", *args, **kwargs)


class PillowForm(ProductForm):
    class Meta:
        model = models.Pillow
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(PillowForm, self).__init__("Подушка", *args, **kwargs)


class MattressPadsForm(ProductForm):
    class Meta:
        model = models.MattressPads
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(MattressPadsForm, self).__init__("Наматрсаник", *args, **kwargs)


class BlanketForm(ProductForm):
    class Meta:
        model = models.Blanket
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(BlanketForm, self).__init__("Одеяло", *args, **kwargs)

class BedSheetsForm(ProductForm):
    class Meta:
        model = models.BedSheets
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(BedSheetsForm, self).__init__("Постельное белье", *args, **kwargs)


class BedForm(ProductForm):
    class Meta:
        model = models.Bed
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(BedForm, self).__init__("Кровать", *args, **kwargs)


class StandForm(ProductForm):
    class Meta:
        model = models.Stand
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(StandForm, self).__init__("Тумба", *args, **kwargs)
        

class BasisForm(ProductForm):
    class Meta:
        model = models.Basis
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(BasisForm, self).__init__("Основание", *args, **kwargs)