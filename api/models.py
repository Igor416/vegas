from django.db import models

# Create your models here.
def toString(queryset):
    s = ''

    for record in queryset:
        s += record.name + ', '

    return s[0:-2]

class Product(models.Model):
    name = models.CharField("Название", max_length=32)

    def __str__(self):
        return f'Продукт: "{self.name}"'

    class Meta:
        verbose_name = 'продукт'
        verbose_name_plural = 'продукты'

class Choice(models.Model):
    name = models.CharField("Характеристика", max_length=32)
    product = models.ManyToManyField(Product)
    property = models.CharField("Вариант выбора", max_length=32)

    def __str__(self):
        return f'Вариант выбора для "{self.name}" в "{toString(self.product.all())}": "{self.property}"'

    class Meta:
        verbose_name = 'вариант выбора'
        verbose_name_plural = 'варианты выбора'

class Mattrass(models.Model):
    rigidities = [("middlehard", "среднежесткий"), ("average", "средний")]
    collections = [("Comfort", "Comfort"), ("Modern", "Modern")]
    countries = [("Belarus", "Беларусь")]

    type = models.ManyToManyField(Choice)
    grown_up = models.BooleanField("Для взрослых", default=True)

    garanty = models.IntegerField("Гарантийный срок")
    height = models.IntegerField("Высота")
    max_pressure = models.IntegerField("Макс. нагрузка")
    rigidity1 = models.CharField("Уровень жесткости стороны 1", choices=rigidities, max_length=32)
    rigidity2 = models.CharField("Уровень жесткости стороны 2", choices=rigidities, max_length=32)
    springs = models.IntegerField("Пружины")
    lifetime = models.IntegerField("Срок Службы")
    collection = models.CharField("Коллекция", choices=collections, max_length=32)
    cover = models.BooleanField("Съемный чехол")
    country = models.CharField("Страна производства", choices=countries, max_length=32)

    def __str__(self):
        return f'Матрас: "{self.type}"'

    class Meta:
        verbose_name = 'матрас'
        verbose_name_plural = 'матрасы'

class Furniture(models.Model):
    def __str__(self):
        return f'Мебель: '

    class Meta:
        verbose_name = 'мебель'
        verbose_name_plural = 'мебель'
