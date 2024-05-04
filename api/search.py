from .import models
from . import catalog as ct

def isearch(search, lang, objects):
  queryset = objects.none()
  if isinstance(objects, models.products.managers.BedSheetsManager):
    if lang == 'en':
      queryset = objects.filter(name_en__icontains=search)
    elif lang == 'ru':
      #sqllite3 doesn't support utf-8 search with insensitive case
      queryset = objects.filter(name_ru__contains=search.lower())
      queryset |= objects.filter(name_ru__contains=search.title())
    elif lang == 'ro':
      queryset = objects.filter(name_ro__icontains=search)
  elif lang == 'en':
    queryset = objects.filter(name_en_s__icontains=search)
  elif lang == 'ru':
    #sqllite3 doesn't support utf-8 search with insensitive case
    queryset = objects.filter(name_ru_s__contains=search.lower())
    queryset |= objects.filter(name_ru_s__contains=search.title())
  elif lang == 'ro':
    queryset = objects.filter(name_ro_s__icontains=search)
  else:
    queryset = objects.filter(name__icontains=search)
  return queryset

def search_categories(search, lang):
  return isearch(search, lang, models.Category.objects)

def search_products(search, lang):
  for product_name in ct.get_all_categories():
    model = getattr(models, product_name)
    yield isearch(search, lang if model is models.BedSheets else '', model.objects)