from django.db import models
from .size import Size

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