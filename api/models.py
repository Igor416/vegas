from django.db import models

# Create your models here.

class Mattrass(models.Model):
    rigidities = [("middlehard", "среднежесткий"), ("average", "средний")]
    collections = [("Comfort", "Comfort"), ("Modern", "Modern")]
    countries = [("Belarus", "Беларусь")]

    type = models.ForeignKey(Type, on_delete=models.RESTRICT)
    grown_up = models.BooleanField(verbose_name="Для взрослых", default=True)
    garanty = models.IntegerField(verbose_name="Гарантийный срок")
    height = models.IntegerField(verbose_name="Высота")
    max_pressure = models.IntegerField(verbose_name="Макс. нагрузка")
    rigidity1 = models.CharField(verbose_name="Уровень жесткости стороны 1", choices=rigidities, max_length=30)
    rigidity2 = models.CharField(verbose_name="Уровень жесткости стороны 2", choices=rigidities, max_length=30)
    springs = models.IntegerField(verbose_name="Пружины")
    lifetime = models.IntegerField(verbose_name="Срок Службы")
    collection = models.CharField(verbose_name="Коллекция", choices=collections, max_length=30)
    cover = models.BooleanField(verbose_name="Съемный чехол")
    country = models.CharField(verbose_name="Страна производства", choices=countries, max_length=30)

    def __str__(self):
        return f'Mattrass: "{self.type}"'

    class Meta:
        verbose_name = 'mattrass'
        verbose_name_plural = 'mattrasses'
