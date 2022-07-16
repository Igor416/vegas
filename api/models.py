from django.template.defaultfilters import slugify
from django.db import models
from django.core.validators import FileExtensionValidator
from .catalog import Manager

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
    return hasattr(getattr(model, field), 'rel')

class Category(models.Model):
    choices = manager.get_pr_choices()

    name = models.CharField('Название', max_length=32, choices=choices, unique=True)

    def __str__(self):
        return manager.get_pr_trans(self.name)

    class Meta:
        verbose_name = 'категория'
        verbose_name_plural = 'категории'

class Choice(models.Model):
    choices = manager.get_prop_choices()

    name = models.CharField('Характеристика', choices=choices, max_length=32)
    category = models.ManyToManyField(Category, related_name='categoryC', verbose_name='Категория')
    property_ru = models.CharField('Вариант выбора (ru)', max_length=32)
    property_ro = models.CharField('Вариант выбора (ro)', max_length=32, blank=True)

    def __str__(self):
        lst = list(map(lambda ctg: str(ctg), self.category.all()))
        s = ', '.join(lst)
        return f'Вариант выбора для "{manager.get_prop_trans(self.name)}"; в категори{"и" if len(lst) == 1 else "ях"} "{s}": "{self.property_ru}"'

    def save(self, *args, **kwargs):
        self.property_ru = self.property_ru.lower()
        if self.property_ro == '':
            self.property_ro = self.property_ru
        else:
            self.property_ro = self.property_ro.lower()
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
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='Категория', null=True)
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
    image = models.ImageField('Фото товара', upload_to='media/images')

    def is_shortcut(self):
        return not '_' in self.get_name()

    class Meta:
        verbose_name = 'фотография'
        verbose_name_plural = 'фотографии'

class Video(File):
    validators = [FileExtensionValidator(allowed_extensions=['MOV','avi','mp4','webm','mkv'])]
    video = models.FileField('Видео о товаре', upload_to='media/videos', validators=validators)

    class Meta:
        verbose_name = 'видео'
        verbose_name_plural = 'видео'

from . import managers
class Product(models.Model):
    name = models.CharField('Название', max_length=32, unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='Категория')
    desc = models.TextField('Описание')
    discount = models.SmallIntegerField('Скидка (%)', default=0)
    shortcut = models.ForeignKey(Image, null=True, on_delete=models.SET_NULL, verbose_name='Фото на каталог')
    images = models.ManyToManyField(Image, related_name='images%(class)s', verbose_name='Фотографии товара')
    videos = models.ManyToManyField(Video, related_name='videos%(class)s', verbose_name='Видео товара', blank=True)
    best = models.BooleanField('Лидер продаж', default=False)

    @classmethod
    def set_manager(cls):
        cls.objects = getattr(managers, cls.get_name() + 'Manager')(cls)

    @classmethod
    def get_name(cls):
        return cls.__name__

    def slug(self):
        return slugify(self.name)

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

class Mattrass(Product):
    height = models.IntegerField('Высота')
    springs = models.IntegerField('Кол-во пружин в двуспальном матрасе', default=0)
    max_pressure = models.IntegerField('Макс. нагрузка')
    lifetime = models.IntegerField('Срок Службы', default=10)
    cover = models.BooleanField('Съемный чехол', default=True)
    sizes = models.ManyToManyField(Size, related_name='sizesM', verbose_name='Размеры')
    
    mattrass_type = create_related_field('mattrass_type', '', True)
    age = create_related_field('age', 'M', True)
    rigidity1 = create_related_field('rigidity1')
    rigidity2 = create_related_field('rigidity2')
    collection = create_related_field('collection')
    springblock = create_related_field('springblock')
    package = create_related_field('package', 'M')
    construction = create_related_field('construction', '', True)

class Pillow(Product):
    width = models.IntegerField('Ширина')
    length = models.IntegerField('Длина')
    height = models.IntegerField('Справочная высота')
    cover = models.BooleanField('Съемный чехол', default=True)

    age = create_related_field('age', 'P', True)
    material_filler = create_related_field('material_filler')
    cover = create_related_field('cover', 'P', True)


class MattrassPad(Product):
    height = models.IntegerField('Высота')
    cover = models.BooleanField('Съемный чехол', default=True)
    sizes = models.ManyToManyField(Size, related_name='sizesMP', verbose_name='Размеры')

    mattrasspad_type = create_related_field('mattrasspad_type', '', True)
    binding = create_related_field('binding')
    cover = create_related_field('cover', 'MP', True)

class Blanket(Product):
    density = models.IntegerField('Плотность наполнения')
    sizes = models.ManyToManyField(Size, related_name='sizesBl', verbose_name='Размеры')
    
    blanket_type = create_related_field('blanket_type', '', True)
    age = create_related_field('age', 'Bl', True)
    filling = create_related_field('filling')
    package = create_related_field('package', 'Bl')
    blanket_color = create_related_field('blanket_color')

class BedSheets(Product):
    sizes = models.ManyToManyField(Size, related_name='sizesBS', verbose_name='Размеры')
    
    bedsheets_type = create_related_field('bedsheets_type', '', True)
    package = create_related_field('package', 'BS')
    bedsheets_color = create_related_field('bedsheets_color')
    tissue = create_related_field('tissue')

class Bed(Product):
    height = models.IntegerField('Высота изголовья')
    sizes = models.ManyToManyField(Size, related_name='sizesB', verbose_name='Размеры')

    bed_type = create_related_field('bed_type', '', True)

class Stand(Product):
    width = models.IntegerField('Ширина')
    length = models.IntegerField('Длина')
    height = models.IntegerField('Высота')

    material = create_related_field('material')

class Basis(Product):
    distance = models.IntegerField('Расстяоние межда ламелями')
    width = models.IntegerField('Ширина ламели')
    height = models.IntegerField('Высота')
    legs_height = models.IntegerField('Высота ножек')
    recomended = models.ManyToManyField(Mattrass, related_name='recomendedBa', verbose_name='Рекомендовано для матрассов')
    sizes = models.ManyToManyField(Size, related_name='sizesBa', verbose_name='Размеры')

    basis_type = create_related_field('basis_type', '', True)