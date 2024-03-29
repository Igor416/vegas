from django.db import models
from .category import Category

class Size(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, blank=True, null=True, verbose_name='Категория')
    product = models.CharField('Название продукта', max_length=32, blank=True)
    width = models.SmallIntegerField('Ширина', default=80)
    length = models.SmallIntegerField('Длина', default=200)
    priceEUR = models.SmallIntegerField('Цена (евро)', default=0)
    discount = models.SmallIntegerField('Скидка (%)', default=0)
    on_sale = models.BooleanField('На распродаже', default=False)

    def set_product_and_category(self, product, category):
        self.product = product
        self.category = category
        self.save()

    def __str__(self):
        return f'Размер продукта {self.product}: {self.width} x {self.length} по цене {self.priceEUR} (EUR){f", со скидкой {self.discount}%" if self.discount != 0 else ""}'

    class Meta:
        verbose_name = 'размер'
        verbose_name_plural = 'размеры'

class BedSheetsSize(Size):
    duvet_cover_size = models.ForeignKey(Size, related_name='duvet_cover_size%(class)s', on_delete=models.SET_NULL, null=True, verbose_name='Пододеяльник')
    sheet_size = models.ForeignKey(Size, related_name='sheet_size%(class)s', on_delete=models.SET_NULL, null=True, verbose_name='Простыня')
    elasticated_sheet_size = models.ForeignKey(Size, related_name='elasticated_sheet_size%(class)s', on_delete=models.SET_NULL, null=True, verbose_name='Простыня на резинке')
    pillowcase_sizes = models.ManyToManyField(Size, related_name='pillowcase_sizes%(class)s', verbose_name='Наволочки')

    def set_product_and_category(self, bed_sheets, category):
        super().set_product_and_category(bed_sheets, category)
        self.duvet_cover_size.product = bed_sheets
        self.duvet_cover_size.category = category

        try:
            self.sheet_size.product = bed_sheets
            self.sheet_size.category = category
        except AttributeError:
            pass

        try:
            self.elasticated_sheet_size.product = bed_sheets
            self.elasticated_sheet_size.category = category
        except AttributeError:
            pass

        for pillowcase_size in self.pillowcase_sizes.all():
            pillowcase_size.product = bed_sheets
            pillowcase_size.category = category
        self.save()

    class Meta:
        verbose_name = 'размер постельного белья'
        verbose_name_plural = 'размеры постельного белья'