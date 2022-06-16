from django import forms
from .models import Product, Choice, Mattrass, Pillow, MattressPads, Blanket, BedSheets, Bed, Stand, Basis

class ProductForm(forms.ModelForm):
    def __init__(self, name, *args, **kwargs):
        super(ProductForm, self).__init__(*args, **kwargs)
        for field in self.fields.values():
            if hasattr(field, 'queryset'):
                field.queryset = Choice.objects.filter(product=name, name=field.label)

class MattrassForm(ProductForm):
    class Meta:
        model = Mattrass
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(MattrassForm, self).__init__("Матрас", *args, **kwargs)


class PillowForm(ProductForm):
    class Meta:
        model = Pillow
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(PillowForm, self).__init__("Подушка", *args, **kwargs)


class MattressPadsForm(ProductForm):
    class Meta:
        model = MattressPads
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(MattressPadsForm, self).__init__("Наматрсаник", *args, **kwargs)


class BlanketForm(ProductForm):
    class Meta:
        model = Blanket
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(BlanketForm, self).__init__("Одеяло", *args, **kwargs)

class BedSheetsForm(ProductForm):
    class Meta:
        model = BedSheets
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(BedSheetsForm, self).__init__("Постельное белье", *args, **kwargs)


class BedForm(ProductForm):
    class Meta:
        model = Bed
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(BedForm, self).__init__("Кровать", *args, **kwargs)


class StandForm(ProductForm):
    class Meta:
        model = Stand
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(StandForm, self).__init__("Тумба", *args, **kwargs)
        

class BasisForm(ProductForm):
    class Meta:
        model = Basis
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(BasisForm, self).__init__("Основание", *args, **kwargs)