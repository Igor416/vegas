from django.db import models
from . import catalog as ct, create_related_field
from . import managers
from .category import Category
from .choice import Choice
from .size import Size, BedSheetsSize
from .files import Image, Video
from .marker import Marker, add_markers
from .technologies import Technology, LayerMattress, LayerPillow, LayerMattressPad

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
        default_filtering = ct.get_default_filtering(self.get_name())
        try:
            property = getattr(self, default_filtering).property_ru
        except:
            property = getattr(self, default_filtering).first().property_ru
        return f'{self._meta.verbose_name}: {self.name}, {ct.get_prop_trans(default_filtering)}: {property}'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.category:
            for size in self.sizes.all():
                if size.product == '' or not size.category:
                    size.set_product_and_category(self.name, self.category)

        if hasattr(self, 'structure'):
           self.structure.update(isTechnology=False)
        if hasattr(self, 'technologies'):
           self.structure.update(isTechnology=True)
        super().save(*args, **kwargs)

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
    age = create_related_field('age', True, True)
    rigidity1 = create_related_field('rigidity1', True)
    rigidity2 = create_related_field('rigidity2', True)
    collection = create_related_field('collection')
    springblock = create_related_field('springblock')
    construction = create_related_field('construction')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.category and self.max_pressure:
            add_markers(self)
            super().save(*args, **kwargs)

class Pillow(Product):
    height = models.IntegerField(default=0)
    case = models.BooleanField(default=True)

    structure = models.ManyToManyField(Technology, through=LayerPillow, through_fields=('product', 'technology'), related_name='structure_%(class)s', verbose_name='Структура', blank=True)

    age = create_related_field('age', True, True)
    material_filler = create_related_field('material_filler', '', True)
    cover = create_related_field('cover', True, True)

class MattressPad(Product):
    height = models.IntegerField(default=0)
    case = models.BooleanField(default=True)

    structure = models.ManyToManyField(Technology, through=LayerMattressPad, through_fields=('product', 'technology'), related_name='structure_%(class)s', verbose_name='Структура', blank=True)
    technologies = models.ManyToManyField(Technology, related_name='technologies_%(class)s', verbose_name='Технологии', blank=True)

    age = create_related_field('age', True, True)
    mattresspad_type = create_related_field('mattresspad_type', '', True)
    binding = create_related_field('binding')
    cover = create_related_field('cover', True, True)

class Blanket(Product):
    density = models.IntegerField(default=0)

    blanket_type = create_related_field('blanket_type', '', True)
    age = create_related_field('age', True, True)
    filling = create_related_field('filling', True, True)
    blanket_color = create_related_field('blanket_color')
    cover = create_related_field('cover', True, True)

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

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.category:
            for size in self.sizes.all():
                size.set_category_and_product(self.name_ru, self.category)
            super().save(*args, **kwargs)

class Bed(Product):
    headboard_height = models.IntegerField(default=0)
    extra_length = models.IntegerField(default=0)
    extra_width = models.IntegerField(default=0)

    bed_type = create_related_field('bed_type', '', True)

class Stand(Product):
    height = models.IntegerField(default=0)

    material = create_related_field('material', '', True)

class Basis(Product):
    distance = models.IntegerField(default=45)
    width = models.IntegerField(default=0)
    legs_height = models.IntegerField(default=0)

    recomended = models.ManyToManyField(Choice, related_name='recomendedBasis', verbose_name='Рекомендовано для матрассов')

    def __str__(self):
        return self._meta.verbose_name + ': ' + self.name
