from django.db import models
from django.core.validators import FileExtensionValidator
from .catalog import Manager
from .translations import EN, RU, RO

manager = Manager()

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
    
    name = models.CharField('Название', max_length=32, choices=choices, unique=True)
    name_en_s = models.CharField(max_length=32)
    name_en_pl = models.CharField(max_length=32)
    name_ru_s = models.CharField(max_length=32)
    name_ru_pl = models.CharField(max_length=32)
    name_ro_s = models.CharField(max_length=32)
    name_ro_pl = models.CharField(max_length=32)
    desc_en = models.TextField('Описание (en)', blank=True)
    desc_ru = models.TextField('Описание (ru)', blank=True)
    desc_ro = models.TextField('Описание (ro)', blank=True)

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
        return f'Вариант выбора для "{manager.get_prop_trans(self.name, RU)}"; в категори{"и" if len(lst) == 1 else "ях"} "{s}": "{self.property_ru}"'

    def __eq__(self, obj):
        return self.name == obj.name and self.property_en == obj.property_en

    def save(self, *args, **kwargs):
        self.property_ru = self.property_ru.strip()
        if self.property_en == '':
            self.property_en = self.property_ru
        else:
            self.property_en = self.property_en.strip()
        if self.property_ro == '':
            self.property_ro = self.property_ru
        else:
            self.property_ro = self.property_ro.strip()
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
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    width = models.SmallIntegerField('Ширина')
    length = models.SmallIntegerField('Длина')
    priceEUR = models.SmallIntegerField('Цена (евро)')
    priceMDL = models.SmallIntegerField('Цена (леи)')

    def __str__(self):
        return f'Размер в категории {self.category}: {self.width} x {self.length} по цене {self.priceEUR} (EUR); {self.priceMDL} (MDL)'

    class Meta:
        verbose_name = 'размер'
        verbose_name_plural = 'размеры'   

class File(models.Model):
    def get_name(self):
        return self.image.name.split('/')[-1].split('.')[0] #media/images/[name].jpg -> [name]

    def __str__(self):
        name = self.get_name()
        if '_' in name:
            name = name.replace('_', ' № ')
        else:
            name += ' Для каталога'
        return name

    class Meta:
        abstract = True

class Image(File):
    image = models.ImageField('Фото товара', upload_to='images')

    def get_absolute_url(self):
        return '/media/' + self.image.name.replace('media/', '')

    def is_shortcut(self):
        return not '_' in self.get_name()

    class Meta:
        verbose_name = 'фотография'
        verbose_name_plural = 'фотографии'

class Video(File):
    validators = [FileExtensionValidator(allowed_extensions=['MOV','avi','mp4','webm','mkv'])]
    video = models.FileField('Видео о товаре', upload_to='videos', validators=validators)

    class Meta:
        verbose_name = 'видео'
        verbose_name_plural = 'видео'

from . import managers
class Product(models.Model):
    default_filtering = None

    name = models.CharField('Название', max_length=32, unique=True)
    desc_en = models.TextField('Описание (en)')
    desc_ru = models.TextField('Описание (ru)')
    desc_ro = models.TextField('Описание (ro)')
    discount = models.SmallIntegerField('Скидка (%)', default=0)
    best = models.BooleanField('Лидер продаж', default=False)

    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='Категория')
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
        return self._meta.verbose_name + ': ' + self.name

    def save(self, *args, **kwargs):
        self.name = self.name.title()
        super(Product, self).save(*args, **kwargs)
        if hasattr(self, 'sizes'):
            for size in self.sizes.all():
                size.caterogory = self.category
                size.save()

    class Meta:
        abstract = True

class Mattress(Product):
    default_filtering = 'collection'

    height = models.IntegerField('Высота')
    springs = models.IntegerField('Кол-во пружин в двуспальном матрасе', default=0)
    max_pressure = models.IntegerField('Макс. нагрузка')
    lifetime = models.IntegerField('Срок Службы', default=10)
    cover = models.BooleanField('Съемный чехол', default=True)
    
    mattress_type = create_related_field('mattress_type', '', True)
    age = create_related_field('age', 'M', True)
    rigidity1 = create_related_field('rigidity1')
    rigidity2 = create_related_field('rigidity2')
    collection = create_related_field('collection')
    springblock = create_related_field('springblock')
    construction = create_related_field('construction', '', True)

class Pillow(Product):
    default_filtering = 'material_filler'

    height = models.IntegerField('Справочная высота')
    cover = models.BooleanField('Съемный чехол', default=True)

    age = create_related_field('age', 'P', True)
    material_filler = create_related_field('material_filler', '', True)
    cover = create_related_field('cover', 'P', True)


class MattressPad(Product):
    default_filtering = 'mattresspad_type'

    height = models.IntegerField('Высота')
    cover = models.BooleanField('Съемный чехол', default=True)

    mattresspad_type = create_related_field('mattresspad_type', '', True)
    binding = create_related_field('binding')
    cover = create_related_field('cover', 'MP', True)

class Blanket(Product):
    default_filtering = 'blanket_type'

    density = models.IntegerField('Плотность наполнения')
    
    blanket_type = create_related_field('blanket_type', '', True)
    age = create_related_field('age', 'Bl', True)
    filling = create_related_field('filling')
    blanket_color = create_related_field('blanket_color')

class BedSheets(Product):
    default_filtering = 'bedsheets_type'
    
    bedsheets_type = create_related_field('bedsheets_type', '', True)
    bedsheets_color = create_related_field('bedsheets_color')
    tissue = create_related_field('tissue')

class Bed(Product):
    default_filtering = 'bed_type'

    height = models.IntegerField('Высота изголовья')

    bed_type = create_related_field('bed_type', '', True)

class Stand(Product):
    default_filtering = 'material'

    height = models.IntegerField('Высота')

    material = create_related_field('material')

class Basis(Product):
    default_filtering = 'basis_type'

    distance = models.IntegerField('Расстяоние межда ламелями')
    width = models.IntegerField('Ширина ламели')
    height = models.IntegerField('Высота')
    legs_height = models.IntegerField('Высота ножек')
    recomended = models.ManyToManyField(Mattress, related_name='recomendedBa', verbose_name='Рекомендовано для матрассов')

    basis_type = create_related_field('basis_type', '', True)