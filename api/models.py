from django.db import models
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
    folder = ''
    image = models.ImageField('Фото товара', upload_to=folder)

    def get_absolute_url(self):
        return f'/media/{self.folder}/{self.get_name()}.jpg'

    def is_shortcut(self):
        return not '_' in self.get_name()

    class Meta:
        abstract = True

class Image(File):
    folder = 'products'

    def get_name(self):
        return self.image.name.split('/')[-1].split('.')[0] #products/[name].jpg -> [name]

    def __str__(self):
        name = self.get_name()
        if '_' in name:
            name = name.replace('_', ' № ')
        else:
            name += ' Для каталога'
        return name

    class Meta:
        verbose_name = 'фотография'
        verbose_name_plural = 'фотографии'

class Video(File):
    folder = 'videos'
    video_id = models.CharField('Ссылка на видео', max_length=64, unique=True)

    def save(self, *args, **kwargs):
        self.video_id = self.video_id.split('=')[-1]
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
    name_en = models.CharField('Название (en)', max_length=32, blank=True)
    name_ru = models.CharField('Название (ru)', max_length=32)
    name_ro = models.CharField('Название (ro)', max_length=32, blank=True)
    image = models.ImageField(upload_to='images', verbose_name='Фотография')
    desc_en = models.TextField('Описание (en)')
    desc_ru = models.TextField('Описание (ru)')
    desc_ro = models.TextField('Описание (ro)')

    def get_absolute_url(self):
        return f'/media/{self.image}'

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
    quantity = models.SmallIntegerField(default=1)

    def __str__(self):
        return f'слой матраса {self.product} с технологией {self.technology}, ({self.quantity})'

class LayerPillow(models.Model):
    technology = models.ForeignKey(Technology, on_delete=models.CASCADE)
    product = models.ForeignKey('Pillow', on_delete=models.CASCADE)
    quantity = models.SmallIntegerField(default=1)

    def __str__(self):
        return f'слой подушки {self.product} с технологией {self.technology}, ({self.quantity})'

class LayerMattressPad(models.Model):
    technology = models.ForeignKey(Technology, on_delete=models.CASCADE)
    product = models.ForeignKey('MattressPad', on_delete=models.CASCADE)
    quantity = models.SmallIntegerField(default=1)

    def __str__(self):
        return f'слой наматрасника {self.product} с технологией {self.technology}, ({self.quantity})'

from . import managers
class Product(models.Model):
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
        if hasattr(self, 'sizes'):
            for size in self.sizes.all():
                size.category = self.category
                size.save()
        super(Product, self).save(*args, **kwargs)

    class Meta:
        abstract = True

class Mattress(Product):
    height = models.IntegerField()
    springs = models.IntegerField(default=0)
    max_pressure = models.IntegerField()
    lifetime = models.IntegerField(default=10)
    case = models.BooleanField(default=True)

    structure = models.ManyToManyField(Technology, through=LayerMattress, through_fields=('product', 'technology'), related_name='structure_%(class)s', verbose_name='Структура', blank=True)
    technologies = models.ManyToManyField(Technology, related_name='technologies_%(class)s', verbose_name='Технологии', blank=True)
    
    mattress_type = create_related_field('mattress_type', '', True)
    age = create_related_field('age', '%(class)s', True)
    rigidity1 = create_related_field('rigidity1', '%(class)s')
    rigidity2 = create_related_field('rigidity2', '%(class)s')
    collection = create_related_field('collection')
    springblock = create_related_field('springblock')
    construction = create_related_field('construction', '', True)

    @classmethod
    def get_order(cls):
        return ('mattress_type', 'age', 'height', 'max_pressure', 'rigidity1', 'rigidity2', 'springs', 'lifetime', 'collection', 'springblock', 'construction', 'case')

    @classmethod
    def get_short_order(cls):
        return ('age', 'height', 'max_pressure', 'rigidity1', 'rigidity2', 'springs', 'construction', 'case')

class Pillow(Product):
    height = models.IntegerField()
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
    height = models.IntegerField()
    case = models.BooleanField(default=True)

    structure = models.ManyToManyField(Technology, through=LayerMattressPad, through_fields=('product', 'technology'), related_name='structure_%(class)s', verbose_name='Структура', blank=True)
    technologies = models.ManyToManyField(Technology, related_name='technologies_%(class)s', verbose_name='Технологии', blank=True)

    mattresspad_type = create_related_field('mattresspad_type', '', True)
    binding = create_related_field('binding')
    rigidity1 = create_related_field('rigidity1', '%(class)s')
    rigidity2 = create_related_field('rigidity2', '%(class)s')
    cover = create_related_field('cover', '%(class)s', True)

    @classmethod
    def get_order(cls):
        return ('mattresspad_type', 'height', 'rigidity1', 'rigidity2', 'case', 'binding', 'cover')

    @classmethod
    def get_short_order(cls):
        return ('mattresspad_type', 'rigidity1', 'rigidity2', 'case', 'cover')

class Blanket(Product):
    density = models.IntegerField()
    
    blanket_type = create_related_field('blanket_type', '', True)
    age = create_related_field('age', '%(class)s', True)
    filling = create_related_field('filling')
    blanket_color = create_related_field('blanket_color')
    cover = create_related_field('cover', '%(class)s', True)

    @classmethod
    def get_order(cls):
        return ('blanket_type', 'age', 'filling', 'density', 'cover', 'blanket_color')

    @classmethod
    def get_short_order(cls):
        return ('blanket_type', 'age', 'filling', 'density', 'cover')

class BedSheets(Product):
    bedsheets_type = create_related_field('bedsheets_type', '', True)
    bedsheets_color = create_related_field('bedsheets_color')
    tissue = create_related_field('tissue')

    @classmethod
    def get_order(cls):
        return ('bedsheets_type', 'bedsheets_color', 'tissue')

    @classmethod
    def get_short_order(cls):
        return ('bedsheets_type', 'bedsheets_color')

class Bed(Product):
    headboard_height = models.IntegerField(default=0)
    lifetime = models.IntegerField(default=10)

    bed_type = create_related_field('bed_type', '', True)

    @classmethod
    def get_order(cls):
        return ('bed_type', 'headboard_height', 'lifetime')

    @classmethod
    def get_short_order(cls):
        return ('bed_type', 'headboard_height', 'lifetime')

class Stand(Product):
    height = models.IntegerField()

    material = create_related_field('material')

    @classmethod
    def get_order(cls):
        return ('height', 'material')

    @classmethod
    def get_short_order(cls):
        return ('height', 'material')

class Basis(Product):
    distance = models.IntegerField()
    width = models.IntegerField()
    height = models.IntegerField()
    legs_height = models.IntegerField()
    recomended = models.ManyToManyField(Mattress, related_name='recomendedBasis', verbose_name='Рекомендовано для матрассов')

    basis_type = create_related_field('basis_type', '', True)

    @classmethod
    def get_order(cls):
        return ('distance', 'height', 'width', 'legs_height', 'recomended')

    @classmethod
    def get_short_order(cls):
        return ('distance', 'height', 'width', 'recomended')