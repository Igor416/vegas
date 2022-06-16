from turtle import distance
from django.db import models

# Create your models here.
class Product(models.Model):
    name = models.CharField("Название", max_length=32)
    vendor_code = models.CharField("Артикул", max_length=8, blank=True)

    def __str__(self):
        return f'Продукт: "{self.name}"'

    def save(self, *args, **kwargs):
        self.name = self.name.title()
        super(Choice, self).__init__(*args, **kwargs)

class Choice(models.Model):
    products = [("Матрас", "Матрас"), ("Подушка", "Подушка"), ("Наматрасник", "Наматрасник"), ("Одеяло", "Одеяло"), ("Постельное белье", "Постельное белье"), ("Кровать", "Кровать"), ("Тумба", "Тумба"), ("Основание", "Основание")]

    name = models.CharField("Характеристика", max_length=32)
    product = models.CharField("Продукт", max_length=16, choices=products)
    property = models.CharField("Вариант выбора", max_length=32)

    def __str__(self):
        return f'Вариант выбора для "{self.name}" в "{self.product}": "{self.property}"'

    def save(self, *args, **kwargs):
        self.name = self.name.title()
        self.property = self.property.lowercase()
        super(Choice, self).__init__(*args, **kwargs)

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
    filling = models.ForeignKey(Choice, related_name="fillingBl", on_delete=models.CASCADE, verbose_name="Крепление")
    density = models.IntegerField("Плотность наполнения")
    package = models.ForeignKey(Choice, related_name="packageBl", on_delete=models.CASCADE, verbose_name="Упаковка")
    tissue = models.ManyToManyField(Choice, related_name="tissueBl", verbose_name="Ткань чехла")
    color = models.ForeignKey(Choice, related_name="colorBl", on_delete=models.CASCADE, verbose_name="Цвет одеяла")
    country = models.ForeignKey(Choice, related_name="countryBl", on_delete=models.CASCADE, verbose_name="Страна производства")

    class Meta:
        verbose_name = "одеяло"
        verbose_name_plural = "одеяла"   

class BedSheets(Product):
    type = models.ManyToManyField(Choice, related_name="typeBS", verbose_name="Тип матраса")
    material = models.ForeignKey(Choice, related_name="materialBS", on_delete=models.CASCADE, verbose_name="Материал наполнения")
    package = models.ForeignKey(Choice, related_name="packageBS", on_delete=models.CASCADE, verbose_name="Упаковка")
    color = models.ForeignKey(Choice, related_name="colorBS", on_delete=models.CASCADE, verbose_name="Цвет одеяла")
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
    recomended = models.ManyToManyField(Choice, related_name="recomendedBa", verbose_name="Рекомендовано для матрассов")
    country = models.ForeignKey(Choice, related_name="countryBa", on_delete=models.CASCADE, verbose_name="Страна производства")

    class Meta:
        verbose_name = 'основание'
        verbose_name_plural = 'основания'