from django.db.models import Manager
from .models import Choice, Size
from . import catalog as ct
from .translations import RU, RO

class ProductManager(Manager):
    def __init__(self, model, *args, **kwargs):
        super(ProductManager, self).__init__(*args, **kwargs)
        self.model = model
        self.objs = model.objects.all()

    def get_all(self):
        return self.objs.all()

    def get_by_name(self, name):
        print(name)
        return self.objs.filter(name=name)

    def get_prop(self, name, property, lang=RU):
        property = property.lower()
        if lang == RU:
            queryset = Choice.objects.get(name=name, property_ru=property)
        if lang == RO:
            queryset = Choice.objects.get(name=name, property_ro=property)
        return queryset

    def get_all_by_size(self, width, height):
        return Size.objects.get(category=self.category, width=width, height=height)

class MattrassManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(MattrassManager, self).__init__(*args, **kwargs)

    def get_by_collection(self, filter):
        filter = filter.replace('Матрасы ', '') #'Матрасы Modern' -> 'Modern'
        collection = self.get_prop(ct.COLLECTION, filter)
        return self.objs.filter(collection=collection)

    def get_by_springless(self, filter):
        queryset = self.objs.filter(springs=0)
        if filter == 'Латексные матрасы':
            collection = self.get_prop(ct.COLLECTION, 'ecolatex')
            queryset.filter(collection=collection)
            queryset = queryset | self.get_by_name('Prince')
            queryset = queryset | self.get_by_name('Cocolatex')
        elif filter == 'Матрасы в рулонной упаковке':
            package = self.get_prop(ct.PACKAGE, 'в скрутке (рулоне)')
            queryset.filter(package=package)
        return queryset

    def get_by_springblock(self, filter):
        type = self.get_prop(ct.MATTRASS_TYPE, filter)
        return self.objs.filter(type=type)
    
    def get_by_age(self, filter):
        AGE = {
            'Матрасы для детей': 'детям',
            'Матрасы для подростков': 'подросткам',
            'Матрасы для взрослых': 'взрослым'
        },
        age = self.get_prop(ct.AGE, AGE[filter])
        return self.objs.filter(age=age)

    def get_by_rigidity(self, filter):
        RIGIDITIES = {
            'Жесткие матрасы': 'жесткий',
            'Матрасы средней жесткости': 'среднежесткий',
            'Мягкие матрасы': 'среднемягкий'
        }

        if filter in list(RIGIDITIES.keys()):
            rigidity1 = self.get_prop(ct.RIGIDITY1, RIGIDITIES[filter])
            rigidity2 = self.get_prop(ct.RIGIDITY2, RIGIDITIES[filter])

            queryset = self.objs.filter(rigidity1=rigidity1)
            queryset += self.objs.filter(rigidity2=rigidity2)

        elif filter == 'Несимметричные матрасы':
            for value in RIGIDITIES.values():
                rigidity1 = self.get_prop(ct.RIGIDITY1, value)
                all = self.objs.filter(rigidity1=rigidity1)
                queryset = self.objs.none()
                for obj in all:
                    if rigidity2.property == rigidity1.property:
                        queryset += obj
        else:
            if filter == 'Матрасы с латексом':
                objs = {'F2', 'F5', 'M1', 'M3', 'M4', 'M5', 'X2', 'X3', 'X4', 'X6', 'X7', 'X8'}
                queryset = self.get_by_springless('Латексные матрасы')
                
            elif filter == 'Матрасы с кокосовой койрой':
                objs = {'F1', 'F3', 'F5', 'M3', 'M4', 'X5', 'X6', 'X7', 'L2', 'L3', 'L6', 'E1'}
                queryset = self.get_by_collection('Vegas Kids')

            elif filter == 'Матрасы с эффектом «памяти»':
                objs = {'F6', 'M2', 'X1', 'A5'}
                queryset = self.objs.none()

            for obj in objs:
                queryset += self.get_by_name(obj)

        return queryset

    def get_by_sizes(self, filter):
        width, length = filter.replace('Матрасы', '').split(' x ')#english x (eks)
        return self.get_by_sizes(width, length)


class BasisManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(BasisManager, self).__init__(*args, **kwargs)


