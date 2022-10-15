from math import ceil
from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from urllib.request import urlretrieve
from vegas.settings import BASE_DIR
from .catalog import Manager
from .translations import EN, RU, RO

manager = Manager()

def save_langs(val_en, val_ru, val_ro):
    val_ru = val_ru.strip()
    if val_en == '':
        val_en = val_ru
    else:
        val_en = val_en.strip()
    if val_ro == '':
        val_ro = val_ru
    else:
        val_ro = val_ro.strip()

    return val_en, val_ru, val_ro

def create_related_field(prop, postfix='', plural=False):
    kwargs = {
        'to': Choice,
        'related_name': prop + postfix
    }

    if plural:
        field = models.ManyToManyField
    else:
        field = models.ForeignKey
        kwargs.update({'on_delete': models.SET_NULL, 'null': True})
    
    return field(**kwargs)
        
def has_multiple_rels(model, field):
    if field == 'rigidity':
        return False
    return hasattr(getattr(model, field), 'rel')

class Category(models.Model):
    choices = manager.get_pr_choices()
    
    name = models.CharField('Название', max_length=32, choices=choices, unique=True, primary_key=True)
    name_en_s = models.CharField(max_length=32)
    name_en_pl = models.CharField(max_length=32)
    name_ru_s = models.CharField(max_length=32)
    name_ru_pl = models.CharField(max_length=32)
    name_ro_s = models.CharField(max_length=32)
    name_ro_pl = models.CharField(max_length=32)

    def __str__(self):
        return self.name_ru_s

    def save(self, *args, **kwargs):
        self.name_en_s = manager.get_pr_trans(self.name, EN, False)
        self.name_en_pl = manager.get_pr_trans(self.name, EN, True)
        self.name_ru_s = manager.get_pr_trans(self.name, RU, False)
        self.name_ru_pl = manager.get_pr_trans(self.name, RU, True)
        self.name_ro_s = manager.get_pr_trans(self.name, RO, False)
        self.name_ro_pl = manager.get_pr_trans(self.name, RO, True)
        super(Category, self).save(*args, **kwargs)

    class Meta:
        verbose_name = 'категория'
        verbose_name_plural = 'категории'

class Choice(models.Model):
    choices = manager.get_prop_choices()

    name = models.CharField('Характеристика', choices=choices, max_length=32)
    category = models.ManyToManyField(Category, related_name='categoryC')
    property_en = models.CharField('Вариант выбора (en)', max_length=64, blank=True)
    property_ru = models.CharField('Вариант выбора (ru)', max_length=64)
    property_ro = models.CharField('Вариант выбора (ro)', max_length=64, blank=True)

    def __str__(self):
        lst = list(map(lambda ctg: str(ctg), self.category.all()))
        s = ', '.join(lst)
        return f'Вариант выбора для "{manager.get_prop_trans(self.name, RU)}" в категори{"и" if len(lst) == 1 else "ях"} "{s}": "{self.property_ru}"'

    def save(self, *args, **kwargs):
        self.property_en, self.property_ru, self.property_ro = save_langs(self.property_en, self.property_ru, self.property_ro)
        super(Choice, self).save(*args, **kwargs)
        self.set_category(*args, **kwargs)

    def set_category(self, *args, **kwargs):
        for category in manager.get_categories(self.name):
            self.category.add(Category.objects.get(name=category))
        super(Choice, self).save(*args, **kwargs)
    
    class Meta:
        verbose_name = 'вариант выбора'
        verbose_name_plural = 'варианты выбора'

class Size(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, blank=True, null=True)
    product = models.CharField('Название продукта', max_length=32, blank=True)
    width = models.SmallIntegerField('Ширина', default=80)
    length = models.SmallIntegerField('Длина', default=200)
    priceEUR = models.SmallIntegerField('Цена (евро)', default=0)
    priceMDL = models.SmallIntegerField('Цена (леи)', default=0)

    def __str__(self):
        return f'Размер продукта {self.product}: {self.width} x {self.length} по цене {self.priceEUR} (EUR); {self.priceMDL} (MDL)'

    def save(self, *args, **kwargs):
        if self.priceMDL == 0:
            self.priceMDL = ceil(self.priceEUR * 20.5)
        super(Size, self).save(*args, **kwargs)

    class Meta:
        verbose_name = 'размер'
        verbose_name_plural = 'размеры'   

class File(models.Model):
    folder = ''
    image = models.ImageField('Фото товара', upload_to=folder)

    def get_absolute_url(self):
        return f'/media/{self.folder}/{self.get_name()}.jpg'

    def get_name(self):
        return self.image.name.split('/')[-1].split('.')[0] #products/[name].jpg -> [name]

    class Meta:
        abstract = True

class Image(File):
    folder = 'products'
    image = models.ImageField('Фото товара', upload_to=folder)

    def __str__(self):
        name = self.get_name()
        if self.is_shortcut():
            name = name.replace('_', ' ')
            name += ' Для каталога'
        else:
            name = name.replace('_', ' ')
            name = ' '.join(name.split(' ')[:-1]) + ' № ' + name.split(' ')[-1]
            
        return name

    def is_shortcut(self):
        return not self.get_name().split('_')[-1].isdigit()
        
    class Meta:
        verbose_name = 'фотография'
        verbose_name_plural = 'фотографии'

class Video(File):
    folder = 'videos'
    video_id = models.CharField('Ссылка на видео', max_length=64, unique=True)

    def save(self, *args, **kwargs):
        if '=' in self.video_id:
            self.video_id = self.video_id.split('=')[-1]
        elif 'youtu.be' in self.video_id:
            self.video_id = self.video_id.split('/')[-1]
        self.image = urlretrieve(f'http://img.youtube.com/vi/{self.video_id}/hqdefault.jpg', str(BASE_DIR) + f'\media\\videos\{self.video_id}.jpg')[0]
        super(Video, self).save(*args, **kwargs)

    def get_name(self):
        return self.video_id

    def __str__(self):
        return f'видео о товаре с id: {self.video_id}'

    class Meta:
        verbose_name = 'видео'
        verbose_name_plural = 'видео'

class Technology(models.Model):
    isTechnology = models.BooleanField('Это технология (или слой)?', default=False)
    name_en = models.CharField('Название (en)', max_length=32, blank=True)
    name_ru = models.CharField('Название (ru)', max_length=32, unique=True)
    name_ro = models.CharField('Название (ro)', max_length=32, blank=True)
    image = models.ImageField('Фотография', upload_to='images')
    desc_en = models.TextField('Описание (en)')
    desc_ru = models.TextField('Описание (ru)')
    desc_ro = models.TextField('Описание (ro)')

    def get_absolute_url(self):
        return '/media/images/' + self.image.name.split('/')[-1]

    def save(self, *args, **kwargs):
        self.name_en, self.name_ru, self.name_ro = save_langs(self.name_en, self.name_ru, self.name_ro)
        super(Technology, self).save(*args, **kwargs)

    def __str__(self):
        return f'технология {self.name_ru}'

    class Meta:
        verbose_name = 'технология'
        verbose_name_plural = 'технологии'

class LayerMattress(models.Model):
    technology = models.ForeignKey(Technology, on_delete=models.CASCADE)
    product = models.ForeignKey('Mattress', on_delete=models.CASCADE)

    def __str__(self):
        return f'слой матраса {self.product} с технологией {self.technology}'

class LayerPillow(models.Model):
    technology = models.ForeignKey(Technology, on_delete=models.CASCADE)
    product = models.ForeignKey('Pillow', on_delete=models.CASCADE)

    def __str__(self):
        return f'слой подушки {self.product} с технологией {self.technology}'

class LayerMattressPad(models.Model):
    technology = models.ForeignKey(Technology, on_delete=models.CASCADE)
    product = models.ForeignKey('MattressPad', on_delete=models.CASCADE)

    def __str__(self):
        return f'слой наматрасника {self.product} с технологией {self.technology}'

class Marker(models.Model):
    name = models.CharField('Маркер', max_length=64, unique=True, primary_key=True)

    class Meta:
        verbose_name = 'маркер'
        verbose_name_plural = 'маркеры'
    
    def __str__(self):
        return f'маркер {self.name}'

from . import managers
class Product(models.Model):
    name = models.CharField('Название', max_length=32, unique=True)
    desc_en = models.TextField('Описание (en)')
    desc_ru = models.TextField('Описание (ru)')
    desc_ro = models.TextField('Описание (ro)')
    discount = models.SmallIntegerField('Скидка (%)', default=0)
    best = models.BooleanField('Лидер продаж', default=False)

    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='Категория', null=True)
    sizes = models.ManyToManyField(Size, related_name='sizes%(class)s', verbose_name='Размеры')
    shortcut = models.ForeignKey(Image, null=True, on_delete=models.SET_NULL, verbose_name='Фото на каталог')
    images = models.ManyToManyField(Image, related_name='images%(class)s', verbose_name='Фотографии товара', blank=True)
    videos = models.ManyToManyField(Video, related_name='videos%(class)s', verbose_name='Видео товара', blank=True)

    @classmethod
    def set_manager(cls):
        cls.objects = getattr(managers, cls.get_name() + 'Manager')(cls)

    @classmethod
    def get_name(cls):
        return cls.__name__

    def __str__(self):
        try:
            default_filtering = manager.get_default_filtering(self.get_name())
            return f'{self._meta.verbose_name}: {self.name}, {manager.get_prop_trans(default_filtering, RU)}: {getattr(self, default_filtering).property_ru}'
        except AttributeError:
            return f'{self._meta.verbose_name}: {self.name}'

    def save(self, *args, **kwargs):
        super(Product, self).save(*args, **kwargs)
        if self.category:
            for size in self.sizes.all():
                if not size.category or size.product == '':
                    size.category = self.category
                    size.product = self.name
                    size.save()

        if hasattr(self, 'structure'):
            for s in self.structure.all():
                s.isTechnology = False
                s.save()
        if hasattr(self, 'technologies'):
            for t in self.technologies.all():
                t.isTechnology = True
                t.save()
        super(Product, self).save(*args, **kwargs)

    class Meta:
        abstract = True

class Mattress(Product):
    height = models.IntegerField(default=0)
    springs = models.IntegerField(default=0)
    max_pressure = models.IntegerField(default=0)
    lifetime = models.IntegerField(default=10)
    case = models.BooleanField(default=True)
    visible_markers = models.ManyToManyField(Marker, related_name='visible_markers', verbose_name='Маркеры', blank=True)
    markers = models.ManyToManyField(Marker, related_name='markers')

    structure = models.ManyToManyField(Technology, through=LayerMattress, through_fields=('product', 'technology'), related_name='structure_%(class)s', verbose_name='Структура', blank=True)
    technologies = models.ManyToManyField(Technology, related_name='technologies_%(class)s', verbose_name='Технологии', blank=True)
    
    mattress_type = create_related_field('mattress_type', '', True)
    age = create_related_field('age', '%(class)s', True)
    rigidity1 = create_related_field('rigidity1', '%(class)s')
    rigidity2 = create_related_field('rigidity2', '%(class)s')
    collection = create_related_field('collection')
    springblock = create_related_field('springblock')
    construction = create_related_field('construction')

    @classmethod
    def get_order(cls):
        return ('mattress_type', 'age', 'height', 'max_pressure', 'rigidity1', 'rigidity2', 'springs', 'lifetime', 'collection', 'springblock', 'construction', 'case')

    @classmethod
    def get_short_order(cls):
        return ('age', 'height', 'max_pressure', 'rigidity1', 'rigidity2', 'springs', 'construction', 'case')

    def save(self, *args, **kwargs):
        super(Mattress, self).save(*args, **kwargs)
        if self.category and self.max_pressure:
            markers = [
                'height_' + str(self.height),
                'max_pressure_' + str(self.max_pressure),
                'springs_' + str(self.springs)
            ]

            rev = lambda s: 'rigidity_' +  '-'.join(s.replace('rigidity_', '').split('-')[::-1])

            if self.rigidity2:
                markers.append('rigidity_' + self.rigidity1.property_en + '-' + self.rigidity2.property_en)
            else:
                markers.append('rigidity_' + self.rigidity1.property_en)

            self.markers.add(*self.visible_markers.all())
            for marker in markers:
                if marker.startswith('rigidity_'):
                    if len(Marker.objects.filter(name=marker.lower())) == 0 and len(Marker.objects.filter(name=rev(marker.lower()))) == 0:
                        self.markers.create(name=marker.lower())
                    else:
                        try:
                            self.markers.add(Marker.objects.get(name=marker.lower()))
                        except ObjectDoesNotExist:
                            self.markers.add(Marker.objects.get(name=rev(marker.lower())))
                else:
                    try:
                        self.markers.add(Marker.objects.get(name=marker.lower()))
                    except ObjectDoesNotExist:
                        self.markers.create(name=marker.lower())

        super(Mattress, self).save(*args, **kwargs)

class Pillow(Product):
    height = models.IntegerField(default=0)
    case = models.BooleanField(default=True)

    structure = models.ManyToManyField(Technology, through=LayerPillow, through_fields=('product', 'technology'), related_name='structure_%(class)s', verbose_name='Структура', blank=True)

    age = create_related_field('age', '%(class)s', True)
    material_filler = create_related_field('material_filler', '', True)
    cover = create_related_field('cover', '%(class)s', True)

    @classmethod
    def get_order(cls):
        return ('age', 'material_filler', 'height', 'case', 'cover')

    @classmethod
    def get_short_order(cls):
        return ('age', 'material_filler', 'case', 'cover')

class MattressPad(Product):
    height = models.IntegerField(default=0)
    case = models.BooleanField(default=True)

    structure = models.ManyToManyField(Technology, through=LayerMattressPad, through_fields=('product', 'technology'), related_name='structure_%(class)s', verbose_name='Структура', blank=True)
    technologies = models.ManyToManyField(Technology, related_name='technologies_%(class)s', verbose_name='Технологии', blank=True)

    age = create_related_field('age', '%(class)s', True)
    mattresspad_type = create_related_field('mattresspad_type', '', True)
    binding = create_related_field('binding')
    cover = create_related_field('cover', '%(class)s', True)

    @classmethod
    def get_order(cls):
        return ('age', 'mattresspad_type', 'height', 'case', 'binding', 'cover')

    @classmethod
    def get_short_order(cls):
        return ('age', 'mattresspad_type', 'case', 'cover')

class Blanket(Product):
    density = models.IntegerField(default=0)
    
    blanket_type = create_related_field('blanket_type', '', True)
    age = create_related_field('age', '%(class)s', True)
    filling = create_related_field('filling', '%(class)s', True)
    blanket_color = create_related_field('blanket_color')
    cover = create_related_field('cover', '%(class)s', True)

    @classmethod
    def get_order(cls):
        return ('blanket_type', 'age', 'filling', 'density', 'cover', 'blanket_color')

    @classmethod
    def get_short_order(cls):
        return ('blanket_type', 'age', 'filling', 'density', 'cover')

class BedSheetsSize(Size):
    duvet_cover_size = models.ForeignKey(Size, related_name='duvet_cover_size%(class)s', on_delete=models.SET_NULL, null=True, verbose_name='Пододеяльник')
    sheet_size = models.ForeignKey(Size, related_name='sheet_size%(class)s', on_delete=models.SET_NULL, null=True, verbose_name='Простыня')
    elasticated_sheet_size = models.ForeignKey(Size, related_name='elasticated_sheet_size%(class)s', on_delete=models.SET_NULL, null=True, verbose_name='Простыня на резинке')
    pillowcase_sizes = models.ManyToManyField(Size, related_name='pillowcase_sizes%(class)s', verbose_name='Наволочки')

    class Meta:
        verbose_name = 'размер постельного белья'
        verbose_name_plural = 'размеры постельного белья'

class BedSheets(Product):
    name = None
    name_en = models.CharField('Название (en)', max_length=32)
    name_ru = models.CharField('Название (ru)', max_length=32)
    name_ro = models.CharField('Название (ro)', max_length=32)
    sizes = models.ManyToManyField(BedSheetsSize, related_name='sizes%(class)s', verbose_name='Размеры')
    bedsheets_type = create_related_field('bedsheets_type', '', True)
    bedsheets_color = create_related_field('bedsheets_color')
    tissue = create_related_field('tissue')

    def __str__(self):
        return f'{self._meta.verbose_name}: {self.name_ru}, {self.bedsheets_color.property_ru}'

    @classmethod
    def get_order(cls):
        return ('bedsheets_type', 'bedsheets_color', 'tissue')

    @classmethod
    def get_short_order(cls):
        return ('bedsheets_type', 'bedsheets_color')

    def save(self, *args, **kwargs):
        super(BedSheets, self).save(*args, **kwargs)
        if self.category:
            for size in self.sizes.all():
                size.duvet_cover_size.product = self
                size.duvet_cover_size.category = self.category

                try:
                    size.sheet_size.product = self
                    size.sheet_size.category = self.category
                except AttributeError:
                    pass
                
                try:
                    size.elasticated_sheet_size.product = self
                    size.elasticated_sheet_size.category = self.category
                except AttributeError:
                    pass

                for pillowcase_size in size.pillowcase_sizes.all():
                    pillowcase_size.product = self
                    pillowcase_size.category = self.category
            super(BedSheets, self).save(*args, **kwargs)

class Bed(Product):
    headboard_height = models.IntegerField(default=0)
    extra_length = models.IntegerField(default=0)
    extra_width = models.IntegerField(default=0)

    bed_type = create_related_field('bed_type', '', True)

    @classmethod
    def get_order(cls):
        return ('bed_type', 'headboard_height', 'extra_length', 'extra_width')

    @classmethod
    def get_short_order(cls):
        return ('bed_type', 'headboard_height')

class Stand(Product):
    height = models.IntegerField(default=0)

    material = create_related_field('material', '', True)

    @classmethod
    def get_order(cls):
        return ('height', 'material')

    @classmethod
    def get_short_order(cls):
        return ('height', 'material')

class Basis(Product):
    distance = models.IntegerField(default=45)
    width = models.IntegerField(default=0)
    legs_height = models.IntegerField(default=0)

    recomended = models.ManyToManyField(Choice, related_name='recomendedBasis', verbose_name='Рекомендовано для матрассов')

    def __str__(self):
        return self._meta.verbose_name + ': ' + self.name

    @classmethod
    def get_order(cls):
        return ('distance', 'width', 'legs_height', 'recomended')

    @classmethod
    def get_short_order(cls):
        return ('distance', 'width', 'recomended')