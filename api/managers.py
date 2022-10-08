from django.db.models import Manager
from .models import Category, Choice, Size
from . import catalog as ct

class ProductManager(Manager):
    def __init__(self, model, *args, **kwargs):
        super(ProductManager, self).__init__(*args, **kwargs)
        self.model = model
        self.category = Category.objects.get(name=self.model.get_name())
        self.objs = model.objects.all()

    def get_all(self):
        return self.objs.all()

    def get_filtered(self, type, filter):
        if type == 'all':
            return self.get_all()

        if not filter:
            return self.get_by_type(type.replace('_', ' '))

        queryset = getattr(self, 'get_by_' + type)(filter)

        return queryset

    def get_by_name(self, name):
        return self.objs.get(name=name)

    def get_props(self, name):
        queryset = Choice.objects.filter(name=name)
        return queryset

    def get_prop(self, name, property):
        if len(property.split(' ')) > 1:
            queryset = Choice.objects.get(name=name, property_en=property)
        else:
            queryset = Choice.objects.get(name=name, property_en=property.title())
        return queryset

    def get_size(self, width, length):
        return Size.objects.filter(category=self.category, width=width, length=length)

class MattressManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(MattressManager, self).__init__(*args, **kwargs)

    def get_by_collection(self, filter):
        filter = filter.replace('Mattresses ', '') #'Матрасы Modern' -> 'Modern'
        collection = self.get_prop(ct.COLLECTION, filter)
        return self.objs.filter(collection=collection)

    def get_by_springless(self, filter):
        queryset = self.objs.filter(springs=0)
        if filter == 'Mattresses with latex':
            collection = self.get_prop(ct.COLLECTION, 'Ecolatex')
            queryset = queryset.filter(collection=collection)
            queryset |= self.objs.filter(name='Prince')
            queryset |= self.objs.filter(name='Cocolatex')
        return queryset

    def get_by_springblock(self, filter):
        type = self.get_prop(ct.MATTRESS_TYPE, filter)
        return self.objs.filter(mattress_type=type)
    
    def get_by_age(self, filter):
        age = self.get_prop(ct.AGE, filter.replace('Mattresses for ', ''))
        return self.objs.filter(age=age)

    def get_by_children(self, filter):
        queryset = self.get_by_age('children')
        springless = self.get_by_springless(None)
        if filter == 'With springs':
            queryset = queryset.difference(springless)
        elif filter == 'Springless':
            queryset = springless

        return queryset

    def get_by_rigidity(self, filter):
        RIGIDITIES = {
            'Hard mattresses': 'firm',
            'Medium firm mattresses': 'semifirm',
            'Soft mattresses': 'soft'
        }

        if filter in list(RIGIDITIES.keys()):
            rigidity1 = self.get_prop(ct.RIGIDITY, RIGIDITIES[filter])
            rigidity2 = self.get_prop(ct.RIGIDITY, RIGIDITIES[filter])

            queryset = self.objs.filter(rigidity1=rigidity1)
            queryset = queryset.union(self.objs.filter(rigidity2=rigidity2))

        elif filter == 'Non-symmetrical Mattresses':
            queryset = self.objs.none()
            for rigidity1 in self.get_props(ct.RIGIDITY):
                for obj in self.objs.filter(rigidity1=rigidity1):
                    if obj.rigidity2 is None:
                        continue
                    elif obj.rigidity2.property_en == rigidity1.property_en:
                        queryset |= self.objs.filter(name=obj.name)
        else:
            if filter == 'Mattresses with latex':
                objs = {'F2', 'F5', 'M1', 'M3', 'M4', 'M5', 'X2', 'X3', 'X4', 'X6', 'X7', 'X8'}
                queryset = self.get_by_springless(filter)
                
            elif filter == 'Mattresses with coconut coir':
                objs = {'F1', 'F3', 'F5', 'M3', 'M4', 'X5', 'X6', 'X7', 'L2', 'L3', 'L6'}
                queryset = self.get_by_collection('Vegas Kids')

            elif filter == 'Mattresses with memory effect':
                objs = {'F6', 'M2', 'X1', 'A5'}
                queryset = self.objs.none()

            for obj in objs:
                queryset |= self.objs.filter(name=obj)

        return queryset

    def get_by_sizes(self, filter):
        width = filter.replace('Mattresses ', '').split(' x ')[0]#english x (eks)
        sizes = self.get_size(width, 200)
        return self.objs.filter(name__in=[size.product for size in sizes])
        
class PillowManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(PillowManager, self).__init__(*args, **kwargs)

    def get_by_types_and_forms(self, filter):
        queryset = self.objs.none()

        if filter == 'Classic form':
            objs = {'9', '14', '16', '19', '20', 'Junior', 'Bimbo', 'Latex Royal', 'Extra Memory'}
            
        elif filter == 'Ergonomic form with rollers':
            objs = {'8', '11', '17', '21'}

        elif filter == 'Pillows for pregnants':
            objs = {'Baby Boom'}

        elif filter == 'Others':
            objs = {'Sleep Constructor', 'Beauty'}

        for obj in objs:
            queryset |= self.objs.filter(name=obj)

        return queryset

    def get_by_materials(self, filter):
        if filter == 'With latex':
            material_filler = self.get_prop(ct.MATERIAL_FILLER, 'Latex Monolith')
            
        elif filter == 'Made from foam with memory effect Memory Foam':
            material_filler = self.get_prop(ct.MATERIAL_FILLER, 'MemoryFoam Slices')

        elif filter == 'Pillows with cooling gel':
            material_filler = self.get_prop(ct.MATERIAL_FILLER, 'Cooling Gel')

        return self.objs.filter(material_filler=material_filler)

    def get_by_age(self, filter):
        age = self.get_prop(ct.AGE, filter.replace('Pillows for ', ''))
        return self.objs.filter(age=age)

    def get_by_type(self, type):
        if type == 'children':
            queryset = self.get_by_age('children')

        return queryset

    def get_by_special(self, filter):
        if filter == 'Pillow Beauty for beauty and youngness':
            name = 'Beauty'
            
        elif filter == 'Pillow Baby Boom for pregnants and breastfeeding':
            name = 'Baby Boom'

        elif filter == 'Pillow Travel for trips':
            name = 'Travel'

        return self.objs.filter(name=name)


class MattressPadManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(MattressPadManager, self).__init__(*args, **kwargs)

    def get_by_type(self, type):
        return self.objs.filter(mattresspad_type=self.get_prop(ct.MATTRESSPAD_TYPE, type))

    def get_by_children(self, filter):
        width, length = filter.replace('Size ', '').split(' x ')#english x (eks)
        sizes = self.get_size(width, length)
        return self.objs.filter(name__in=[size.product for size in sizes])

class BlanketManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(BlanketManager, self).__init__(*args, **kwargs)

    def get_by_type(self, type):
        types = {
            'Blankets Bamboo': 'Bamboo',
            'SumWin Blanket': 'SumWin',
            'Blankets with Sheep\'s Wool': 'Sheep',
            'Blankets with Thermoregulation': ''
        }

        queryset = self.objs.none()

        for obj in self.get_all():
            if obj.name.startswith(types[type]):
                queryset |= self.objs.filter(name=obj.name)

        return queryset

    def get_by_children(self, filter):
        if filter == 'All child Blankets':
            return self.objs.all()
        else:
            types = {
                'Light blanket': 'With The Effect Of Thermoregulation',
                'All season blanket': 'All Season',
                'Insulated blanket': 'Insulated',
                'Double blanket (2 in 1)': 'Double (2 In 1)'
            }
            return self.objs.filter(blanket_type=self.get_prop(ct.BLANKET_TYPE, types[filter]))

class BedSheetsManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(BedSheetsManager, self).__init__(*args, **kwargs)

class BedManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(BedManager, self).__init__(*args, **kwargs)

    def get_by_type(self, type):
        if type == 'All beds':
            queryset = self.get_all()
        
        elif 'children' in type:
            queryset = self.objs.none()
            objs = {'Chris', 'Alice', 'Mari'}

            for obj in objs:
                queryset |= self.objs.filter(name=obj)

            return queryset

        else:
            types = {
                'Wooden beds': 'Wood',
                'Beds with soft upholstery': 'Soft Upholstery',
            }
            queryset = self.objs.filter(bed_type=self.get_prop(ct.BED_TYPE, types[type]))

        return queryset

class StandManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(StandManager, self).__init__(*args, **kwargs)

    def get_by_type(self, type):
        if type == "Puffs":
            objs = {'Vicont', 'Ludovic II', 'Ludovic I', 'Filip'}
            queryset = self.objs.none()

            for obj in objs:
                queryset |= self.objs.filter(name=obj)

        else:
            types = {
                'Wooden stands': 'Tree Ash',
                'Stands with soft upholstery': 'Textile',
            }
            queryset = self.objs.filter(material=self.get_prop(ct.MATERIAL, types[type]))

        return queryset

class BasisManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(BasisManager, self).__init__(*args, **kwargs)

    def get_by_type(self, type):
        return self.objs.filter(name=type)
