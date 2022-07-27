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

        return getattr(self, 'get_by_' + type)(filter)

    def get_by_name(self, name):
        return self.objs.filter(name=name)

    def get_props(self, name):
        queryset = Choice.objects.filter(name=name)
        return queryset

    def get_prop(self, name, property):
        queryset = Choice.objects.get(name=name, property_en=property)
        return queryset

    def get_size(self, width, length):
        return Size.objects.get(category=self.category, width=width, length=length)

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
            collection = self.get_prop(ct.COLLECTION, 'ecolatex')
            queryset.filter(collection=collection)
            queryset = queryset.union(self.get_by_name('Prince'))
            queryset = queryset.union(self.get_by_name('Cocolatex'))
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
            queryset = queryset.filter(springless)

        return queryset

    def get_by_rigidity(self, filter):
        RIGIDITIES = {
            'Hard mattresses': 'hard',
            'Medium firm mattresses': 'medium firm',
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
                    if obj.rigidity2 == rigidity1:
                        queryset = queryset.union(self.get_by_name(obj.name))
        else:
            if filter == 'Mattresses with latex':
                objs = {'F2', 'F5', 'M1', 'M3', 'M4', 'M5', 'X2', 'X3', 'X4', 'X6', 'X7', 'X8'}
                queryset = self.get_by_springless(filter)
                
            elif filter == 'Mattresses with coconut coir':
                objs = {'F1', 'F3', 'F5', 'M3', 'M4', 'X5', 'X6', 'X7', 'L2', 'L3', 'L6', 'E1'}
                queryset = self.get_by_collection('Vegas Kids')

            elif filter == 'Mattresses with memory effect':
                objs = {'F6', 'M2', 'X1', 'A5'}
                queryset = self.objs.none()

            for obj in objs:
                queryset = queryset.union(self.get_by_name(obj))

        return queryset

    def get_by_sizes(self, filter):
        width, length = filter.replace('Mattresses ', '').split(' x ')#english x (eks)
        size = self.get_size(width, length)
        return self.objs.filter(sizes=size)
        
class PillowManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(PillowManager, self).__init__(*args, **kwargs)

    def get_filtered(self, type, filter):
        if not filter:
            return self.get_by_type(type)

        return super(PillowManager, self).get_filtered(type, filter)

    def get_by_types_and_forms(self, filter):
        queryset = self.objs.none()

        if filter == 'Classic form':
            objs = {'9', '14', '16', '19', '20', 'Junior', 'Bimbo', 'Latex Royal', 'Extra Memory'}
            
        elif filter == 'Ergonomic form with rollers':
            objs = {'8', '11', '17', '21', 'Bambino'}

        elif filter == 'Pillows for pregnants':
            objs = {'Baby Boom'}

        elif filter == 'Others':
            objs = {'Sleep constructor', 'Beauty', 'Travel'}

        for obj in objs:
            queryset = queryset.union(self.get_by_name(obj))

        return queryset

    def get_by_materials(self, filter):
        if filter == 'With latex':
            material_filler = self.get_prop(ct.MATERIAL_FILLER, 'Latex Monolith')
            
        elif filter == 'Made from foam with memory effect':
            material_filler = self.get_prop(ct.MATERIAL_FILLER, 'MemoryFoam slices')

        elif filter == 'Pillows for pregnants':
            material_filler = self.get_prop(ct.MATERIAL_FILLER, 'Cooling gel')

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

        return self.get_by_name(name)


class MattressPadManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(MattressPadManager, self).__init__(*args, **kwargs)

    def get_filtered(self, type, filter):
        if not filter:
            return self.get_by_type(type)

        return super(MattressPadManager, self).get_filtered(type, filter)

    def get_by_type(self, type):
        return self.objs.filter(mattresspad_type=self.get_prop(ct.MATTRESSPAD_TYPE, type))

    def get_by_children(self, filter):
        width, length = filter.replace('Size ', '').split(' x ')#english x (eks)
        size = self.get_size(width, length)
        return self.objs.filter(sizes=size)

class BlanketManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(BlanketManager, self).__init__(*args, **kwargs)

    def get_filtered(self, type, filter):
        if not filter:
            return self.get_by_type(type)

        return super(BlanketManager, self).get_filtered(type, filter)

    def get_by_type(self, type):
        types = {
            'Blankets Bamboo': 'Bamboo',
            'Blankets SumWin': 'SumWin',
            'Sheep\'s wool': 'Sheep'
        }

        queryset = self.objs.none()

        for obj in self.get_all():
            if obj.name.startswith(types[type]):
                queryset = queryset.union(obj)

        return queryset

    def get_by_children(self, filter):
        if filter == 'All child Blankets':
            return self.objs.filter(age=self.get_prop(ct.AGE, 'children'))
        else:
            filter = filter.lower().replace(' blanket', '')
            return self.objs.filter(blanket_type=self.get_prop(ct.BLANKET_TYPE, filter))

class BedSheetsManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(BedSheetsManager, self).__init__(*args, **kwargs)

class BedManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(BedManager, self).__init__(*args, **kwargs)

    def get_filtered(self, type, filter):
        if not filter:
            return self.get_by_type(type)

        return super(BedManager, self).get_filtered(type, filter)

    def get_by_type(self, type):
        if type == 'All beds':
            queryset = self.get_all()
        
        elif 'children' in type:
            queryset = self.objs.filter(bed_type=self.get_prop(ct.BED_TYPE, 'Beds for children'))

        else:
            types = {
                'Wooden beds': 'Wooden beds',
                'Beds with soft upholstery': 'Upholstered beds',
            }
            queryset = self.objs.filter(bed_type=self.get_prop(ct.BED_TYPE, types[type]))

        return queryset

class StandManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(StandManager, self).__init__(*args, **kwargs)

    def get_filtered(self, type, filter):
        if not filter:
            return self.get_by_type(type)

        return super(StandManager, self).get_filtered(type, filter)

    def get_by_type(self, type):
        types = {
            'Wooden stands': 'Wooden stands',
            'Stands with soft upholstery': 'Upholstered stands',
        }
        return self.objs.filter(bed_type=self.get_prop(ct.BED_TYPE, types[type]))

class BasisManager(ProductManager):
    def __init__(self, *args, **kwargs):
        super(BasisManager, self).__init__(*args, **kwargs)

    
    def get_filtered(self, type, filter):
        if not filter:
            return self.get_by_type(type)

        return super(BasisManager, self).get_filtered(type, filter)

    def get_by_type(self, type):
        type = type.replace('Basis ', '').replace('\'', '')

        return self.objs.filter(bed_type=self.get_prop(ct.BED_TYPE, type))
