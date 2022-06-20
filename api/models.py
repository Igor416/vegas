from turtle import distance
from unicodedata import category
from django.db import models

ALL_CATEGORIES = ['Матрас', 'Подушка', 'Наматрасник', 'Одеяло', 'Постельное белье', 'Кровать', 'Тумба', 'Основание']

COMMON_CATEGORIES  = {
    'Для возраста': ['Матрас', 'Подушка', 'Одеяло'],
    'Страна производства': ALL_CATEGORIES,
    'Упаковка': ['Матрас', 'Подушка', 'Одеяло', 'Постельное белье'],
    'Ткань чехла': ['Подушка', 'Наматрассник', 'Одеяло'],
    'Материал обивки': ['Кровать', 'Тумба'],
}

PROPERTIES = [
    ('ОБЩИЕ', 'ОБЩИЕ'),
    ('Для возраста', 'Для возраста'),
    ('Страна производства', 'Страна производства'),
    ('Упаковка', 'Упаковка'),
    ('Ткань чехла', 'Ткань чехла'),
    ('Материал обивки', 'Материал обивки'),

    ('', ''),
    ('Матрас', 'ТОЛЬКО МАТРАСЫ'),
    ('Коллекция', 'Коллекция'),
    ('Конструкция', 'Конструкция'),
    ('Уровень жесткости стороны 1', 'Уровень жесткости стороны 1'),
    ('Уровень жесткости стороны 2', 'Уровень жесткости стороны 2'),
    ('Пружинный блок', 'Пружинный блок'),
    ('Тип матраса', 'Тип матраса'),

    ('', ''),
    ('Подушка', 'ТОЛЬКО ПОДУШКИ'),
    ('Материал наполнения', 'Материал наполнения'),

    ('', ''),
    ('Наматрасник', 'ТОЛЬКО НАМАТРАСНИКИ'),
    ('Тип наматрасника', 'Тип наматрасника'),
    ('Крепление', 'Крепление'),

    ('', ''),
    ('Одеяло', 'ТОЛЬКО ОДЕЯЛА'),
    ('Цвет одеяла', 'Цвет одеяла'),
    ('Тип одеяла', 'Тип одеяла'),
    ('Наполнитель', 'Наполнитель'),

    ('', ''),
    ('Белье', 'ТОЛЬКОПОСТЕЛЬНОЕ БЕЛЬЕ'),
    ('Тип комплекта', 'Тип комплекта'),
    ('Цвет комплекта', 'Цвет комплекта'),

    ('', ''),
    ('Кровати', 'ТОЛЬКО КРОВАТИ'),
    ('Вид кровати', 'Вид кровати'),
    ('Порода древесины', 'Порода древесины')
]

class ProductManager(models.Manager):
    def get_child_products(self):
        products = {}
        for model in self.model.__subclasses__():
            products.update({model.__name__: model.products.get_self_products()})
        return products

    def get_self_products(self):
        products = {}
        for product in super().get_queryset().all():
            products.update({product.name: product})
        return products

class Category(models.Model):
    products = [("Матрас", "Матрас"), ("Подушка", "Подушка"), ("Наматрасник", "Наматрасник"), ("Одеяло", "Одеяло"), ("Постельное белье", "Постельное белье"), ("Кровать", "Кровать"), ("Тумба", "Тумба"), ("Основание", "Основание")]

    name = models.CharField("Название", max_length=32, choices=products, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'категория'
        verbose_name_plural = 'категории'

class Product(models.Model):
    name = models.CharField("Название", max_length=32)
    category = models.ForeignKey(Category, related_name="categoryP", on_delete=models.CASCADE, verbose_name="Категория")
    products = ProductManager()

    def __str__(self):
        return f'Продукт: "{self.name}"'

    def save(self, *args, **kwargs):
        self.name = self.name.title()
        super(Choice, self).save(*args, **kwargs)

class Choice(models.Model):
    name = models.CharField("Характеристика", choices=PROPERTIES, max_length=32)
    category = models.ManyToManyField(Category, related_name="categoryC", verbose_name="Категория")
    property = models.CharField("Вариант выбора", max_length=32)

    def __str__(self):
        categories = self.category.all()
        lst = list(map(lambda ctg: str(ctg), self.category.all()))
        s = ', '.join(lst)
        return f'Вариант выбора для "{self.name}"; в категори{"и" if len(lst) == 1 else "ях"} "{s}": "{self.property}"'

    def save(self, *args, **kwargs):
        if self.name.startswith('ТОЛЬКО') and self.name == 'ОБЩИЕ':
            return
        self.property = self.property.lower()
        super(Choice, self).save(*args, **kwargs)
        self.set_category()
        super(Choice, self).save(*args, **kwargs)

    def set_category(self):
        print(self, self.name, self.name == 'lol')
        categories = COMMON_CATEGORIES.get(self.name)
        if not categories:
            index = PROPERTIES.index((self.name, self.name))
            for i in range(index, 0, -1):
                if PROPERTIES[i][1].startswith('ТОЛЬКО'):
                    categories = [PROPERTIES[i][0]]
                    break

        for category in categories:
            self.category.add(Category.objects.get(name=category))

    class Meta:
        verbose_name = 'вариант выбора'
        verbose_name_plural = 'варианты выбора'

class Mattrass(Product):
    type = models.ManyToManyField(Choice, related_name="typeM", verbose_name="Тип матраса")
    age = models.ManyToManyField(Choice, related_name="ageM", verbose_name="Для возраста")
    garanty = models.IntegerField("Гарантийный срок")
    height = models.IntegerField("Высота")
    max_pressure = models.IntegerField("Макс. нагрузка")
    rigidity1 = models.ForeignKey(Choice, related_name="rigidity1M", on_delete=models.CASCADE, verbose_name="Уровень жесткости стороны 1")
    rigidity2 = models.ForeignKey(Choice, related_name="rigidity2M", on_delete=models.CASCADE, verbose_name="Уровень жесткости стороны 2")
    springs = models.IntegerField("Кол-во пружин")
    lifetime = models.IntegerField("Срок Службы")
    collection = models.ForeignKey(Choice, related_name="collectionM", on_delete=models.CASCADE, verbose_name="Коллекция")
    springblock = models.ForeignKey(Choice, related_name="springblockM", on_delete=models.CASCADE, verbose_name="Пружинный блок")
    package = models.ForeignKey(Choice, related_name="packageM", on_delete=models.CASCADE, verbose_name="Упаковка")
    construction = models.ManyToManyField(Choice, related_name="constructionM", verbose_name="Конструкция")
    cover = models.BooleanField("Съемный чехол")
    country = models.ForeignKey(Choice, related_name="countryM", on_delete=models.CASCADE, verbose_name="Страна производства")
    
    class Meta:
        verbose_name = 'матрас'
        verbose_name_plural = 'матрасы'

class Pillow(Product):
    age = models.ManyToManyField(Choice, related_name="ageP", verbose_name="Для возраста")
    material = models.ForeignKey(Choice, related_name="materialP", on_delete=models.CASCADE, verbose_name="Материал наполнения")
    garanty = models.IntegerField("Гарантийный срок")
    width = models.IntegerField("Ширина")
    length = models.IntegerField("Длина")
    height = models.IntegerField("Справочная высота")
    package = models.ForeignKey(Choice, related_name="packageP", on_delete=models.CASCADE, verbose_name="Упаковка")
    cover = models.BooleanField("Съемный чехол")
    tissue = models.ManyToManyField(Choice, related_name="tissueP", verbose_name="Ткань чехла")
    country = models.ForeignKey(Choice, related_name="countryP", on_delete=models.CASCADE, verbose_name="Страна производства")

    class Meta:
        verbose_name = "подушка"
        verbose_name_plural = "подушки"

class MattressPads(Product):
    type = models.ManyToManyField(Choice, related_name="typeMP", verbose_name="Тип наматрасника")
    garanty = models.IntegerField("Гарантийный срок")
    height = models.IntegerField("Высота")
    cover = models.BooleanField("Съемный чехол")
    binding = models.ForeignKey(Choice, related_name="bindingMP", on_delete=models.CASCADE, verbose_name="Крепление")
    tissue = models.ManyToManyField(Choice, related_name="tissueMP", verbose_name="Ткань чехла")
    country = models.ForeignKey(Choice, related_name="countryMP", on_delete=models.CASCADE, verbose_name="Страна производства")

    class Meta:
        verbose_name = "наматрасник"
        verbose_name_plural = "наматрасники"

class Blanket(Product):
    type = models.ManyToManyField(Choice, related_name="typeBl", verbose_name="Тип одеяла")
    age = models.ManyToManyField(Choice, related_name="ageBl", verbose_name="Для возраста")
    filling = models.ForeignKey(Choice, related_name="fillingBl", on_delete=models.CASCADE, verbose_name="Наполнитель")
    density = models.IntegerField("Плотность наполнения")
    package = models.ForeignKey(Choice, related_name="packageBl", on_delete=models.CASCADE, verbose_name="Упаковка")
    tissue = models.ManyToManyField(Choice, related_name="tissueBl", verbose_name="Ткань чехла")
    color = models.ForeignKey(Choice, related_name="colorBl", on_delete=models.CASCADE, verbose_name="Цвет одеяла")
    country = models.ForeignKey(Choice, related_name="countryBl", on_delete=models.CASCADE, verbose_name="Страна производства")

    class Meta:
        verbose_name = "одеяло"
        verbose_name_plural = "одеяла"   

class BedSheets(Product):
    type = models.ManyToManyField(Choice, related_name="typeBS", verbose_name="Тип комплекта")
    material = models.ForeignKey(Choice, related_name="materialBS", on_delete=models.CASCADE, verbose_name="Материал наполнения")
    package = models.ForeignKey(Choice, related_name="packageBS", on_delete=models.CASCADE, verbose_name="Упаковка")
    color = models.ForeignKey(Choice, related_name="colorBS", on_delete=models.CASCADE, verbose_name="Цвет комплекта")
    country = models.ForeignKey(Choice, related_name="countryBS", on_delete=models.CASCADE, verbose_name="Страна производства")


    class Meta:
        verbose_name = "постельное белье"
        verbose_name_plural = "постельное белье"   

class Bed(Product):
    type = models.ManyToManyField(Choice, related_name="typeB", verbose_name="Вид кровати")
    material = models.ForeignKey(Choice, related_name="materialB", on_delete=models.CASCADE, verbose_name="Материал обивки", blank=True)
    wood = models.ForeignKey(Choice, related_name="woodB", on_delete=models.CASCADE, verbose_name="Порода древесины")
    garanty = models.IntegerField("Гарантийный срок")
    width = models.IntegerField("Ширина")
    length = models.IntegerField("Длина")
    height = models.IntegerField("Высота изголовья")
    lifetime = models.IntegerField("Срок Службы")
    mattrass_included = models.BooleanField("Матрас в комплекте")
    basis_included  = models.BooleanField("Основание в комплекте")
    country = models.ForeignKey(Choice, related_name="countryB", on_delete=models.CASCADE, verbose_name="Страна производства")

    class Meta:
        verbose_name = 'мебель'
        verbose_name_plural = 'мебель'

class Stand(Product):
    material = models.ForeignKey(Choice, related_name="materialS", on_delete=models.CASCADE, verbose_name="Материал обивки", blank=True)
    garanty = models.IntegerField("Гарантийный срок")
    width = models.IntegerField("Ширина")
    length = models.IntegerField("Длина")
    height = models.IntegerField("Высота изголовья")
    country = models.ForeignKey(Choice, related_name="countryS", on_delete=models.CASCADE, verbose_name="Страна производства")

    class Meta:
        verbose_name = 'тумба'
        verbose_name_plural = 'тумбы'

class Basis(Product):
    garanty = models.IntegerField("Гарантийный срок")
    distance = models.IntegerField("Расстяоние межда ламелями")
    width = models.IntegerField("Ширина ламели")
    recomended = models.ManyToManyField(Mattrass, related_name="recomendedBa", verbose_name="Рекомендовано для матрассов")
    country = models.ForeignKey(Choice, related_name="countryBa", on_delete=models.CASCADE, verbose_name="Страна производства")

    class Meta:
        verbose_name = 'основание'
        verbose_name_plural = 'основания'