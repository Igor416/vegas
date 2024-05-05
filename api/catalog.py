#Categories
MATTRESS = 'Mattress'
PILLOW = 'Pillow'
MATTRESSPAD = 'MattressPad'
BLANKET = 'Blanket'
BEDSHEETS = 'BedSheets'
BED = 'Bed'
STAND = 'Stand'
BASIS = 'Basis'

#Properties
HEIGHT = 'height'
SPRINGS = 'springs'
MAX_PRESSURE = 'max_pressure'
LIFETIME = 'lifetime'
CASE = 'case'
DENSITY = 'density'
HEADBOARD_HEIGHT = 'headboard_height'
EXTRA_LENGTH = 'extra_length'
EXTRA_WIDTH = 'extra_width'
DISTANCE = 'distance'
WIDTH = 'width'
LEGS_HEIGHT = 'legs_height'
RECOMENDED = 'recomended'

#Choices
MATTRESS_TYPE = 'mattress_type'
COLLECTION = 'collection'
CONSTRUCTION = 'construction'
RIGIDITY = 'rigidity'
SPRINGBLOCK = 'springblock'
AGE = 'age'
MATERIAL_FILLER = 'material_filler'
COVER = 'cover'
MATTRESSPAD_TYPE = 'mattresspad_type'
BINDING = 'binding'
BLANKET_TYPE = 'blanket_type'
BLANKET_COLOR = 'blanket_color'
FILLING = 'filling'
BEDSHEETS_TYPE = 'bedsheets_type'
BEDSHEETS_COLOR = 'bedsheets_color'
TISSUE = 'tissue'
BED_TYPE = 'bed_type'
MATERIAL = 'material'

DEFAULT_FILTERING = {
  MATTRESS: COLLECTION,
  PILLOW: MATERIAL_FILLER,
  MATTRESSPAD: MATTRESSPAD_TYPE,
  BLANKET: BLANKET_TYPE,
  BEDSHEETS: BEDSHEETS_TYPE,
  BED: BED_TYPE,
  STAND: MATERIAL,
  BASIS: ''
}

COMMON_PROPERTIES  = {
  AGE: [MATTRESS, PILLOW, BLANKET, MATTRESSPAD],
  RIGIDITY: [MATTRESS, MATTRESSPAD],
  COVER: [PILLOW, MATTRESSPAD, BLANKET]
}

CATALOG = {
  MATTRESS: [MATTRESS_TYPE, COLLECTION, CONSTRUCTION, RIGIDITY, SPRINGBLOCK],
  PILLOW: [MATERIAL_FILLER,],
  MATTRESSPAD: [MATTRESSPAD_TYPE, RIGIDITY, BINDING],
  BLANKET: [BLANKET_TYPE, BLANKET_COLOR, FILLING],
  BEDSHEETS: [BEDSHEETS_TYPE, BEDSHEETS_COLOR, TISSUE],
  BED: [BED_TYPE],
  STAND: [MATERIAL],
  BASIS: []
}

ORDER = {
  MATTRESS: ((AGE, HEIGHT, MAX_PRESSURE, RIGIDITY + '1', RIGIDITY + '2', SPRINGS, CONSTRUCTION, CASE), (MATTRESS_TYPE, AGE, HEIGHT, MAX_PRESSURE, RIGIDITY + '1', RIGIDITY + '2', SPRINGS, LIFETIME, COLLECTION, SPRINGBLOCK, CONSTRUCTION, CASE)),
  PILLOW: ((AGE, MATERIAL_FILLER, CASE, COVER), (AGE, MATERIAL_FILLER, HEIGHT, CASE, COVER)),
  MATTRESSPAD: ((AGE, MATTRESSPAD_TYPE, CASE, COVER), (AGE, MATTRESSPAD_TYPE, HEIGHT, CASE, BINDING, COVER)),
  BLANKET: ((BLANKET_TYPE, AGE, FILLING, DENSITY, COVER), (BLANKET_TYPE, AGE, FILLING, DENSITY, COVER, BLANKET_COLOR)),
  BEDSHEETS: ((BEDSHEETS_TYPE, BEDSHEETS_COLOR), (BEDSHEETS_TYPE, BEDSHEETS_COLOR, TISSUE)),
  BED: ((BED_TYPE, HEADBOARD_HEIGHT), (BED_TYPE, HEADBOARD_HEIGHT, EXTRA_LENGTH, EXTRA_WIDTH)),
  STAND: ((HEIGHT, MATERIAL), (HEIGHT, MATERIAL)),
  BASIS: ((DISTANCE, WIDTH, RECOMENDED), (DISTANCE, WIDTH, LEGS_HEIGHT, RECOMENDED))
}

BEST = [
  [(MATTRESS, 'Favorit'), (MATTRESS, 'F3'), (MATTRESS, 'X3'), (MATTRESS, 'S-3'), (MATTRESS, 'Compact2')],
  [(PILLOW, '20'), (PILLOW, 'Extra Memory'), (PILLOW, '14')],
  [(MATTRESSPAD, 'Stressfree L1'), (BLANKET, 'SumWin'), (MATTRESSPAD, 'Bamboo A1')],
  [(MATTRESS, 'Cocolatex'), (PILLOW, 'Junior'), (PILLOW, 'Baby Boom')],
  [(BED, 'Milana II'), (BED, 'Victoria'), (BED, 'Milana IV')],
  [(BASIS, 'SuperLux'), (BASIS, 'Premium')]
]

from .translations import RU, products, properties, choices
def get_all_categories():
  return list(CATALOG.keys())
    
def get_all_props(product):
  return CATALOG[product] + [prop for prop, prs in COMMON_PROPERTIES.items() if product in prs]

def get_categories(property):
  categories = COMMON_PROPERTIES.get(property, [])
  if not categories:
    for pr, props in CATALOG.items():
      if property in props:
        categories = [pr]
      break
  return categories

def get_default_filtering(product):
  return DEFAULT_FILTERING[product]

def get_pr_trans(product, lang=RU, plural=False):
  return products.get(product, [[]])[lang][int(plural)]

def get_prop_trans(property, lang=RU):
  return (properties.get(property, []) or choices.get(property, []))[lang]

def get_order(model):
  return ORDER[model]

def get_best():
  return (BEST, [(160, 200), (160, 200)])

def get_pr_choices():
  return [(key, get_pr_trans(key)) for key in CATALOG.keys()]

def get_prop_choices():
  choices: list[tuple[str, str]] = [
    ('ОБЩИЕ', 'ОБЩИЕ')
  ]

  for prop in COMMON_PROPERTIES.keys():
    choices.append((prop, get_prop_trans(prop)))

  for pr, props in CATALOG.items():
    choices.append(('', ''))
    choices.append((pr, 'ТОЛЬКО ' + get_pr_trans(pr).upper()))
    for prop in props:
      choices.append((prop, get_prop_trans(prop)))
  return choices