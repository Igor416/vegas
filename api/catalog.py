#Products
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

from .translations import RU
class Manager:
    def get_pr_choices(self):
        return [(key, self.get_pr_trans(key, RU, False)) for key in CATALOG.keys()]

    def get_prop_choices(self):
        choices = [
            ('ОБЩИЕ', 'ОБЩИЕ')
        ]

        for prop in COMMON_PROPERTIES.keys():
            choices.append((prop, self.get_prop_trans(prop, RU)))

        for pr, props in CATALOG.items():
            choices.append(('', ''))
            choices.append((pr, 'ТОЛЬКО ' + self.get_pr_trans(pr, RU, False).upper()))
            for prop in props:
                choices.append((prop, self.get_prop_trans(prop, RU)))
        return choices
    
    def get_all_products(self):
        return list(CATALOG.keys())

    def get_all_props(self, product):
        return CATALOG[product] + [prop for prop, prs in COMMON_PROPERTIES.items() if product in prs]

    def is_product(self, value):
        return value in self.get_all_products()

    def get_categories(self, property):
        categories = COMMON_PROPERTIES.get(property)
        if not categories:
            for pr, props in CATALOG.items():
                if property in props:
                    categories = [pr]
                    break
        return categories
    
    def get_category_by_prop(self, property):
        for category, props in CATALOG.items():
            if property in props:
                return category
        
        return COMMON_PROPERTIES.get(property)[0]

    def get_default_filtering(self, product):
        return DEFAULT_FILTERING[product]

    def get_pr_trans(self, product, lang, plural):
        from .translations import products
        return products.get(product)[lang][int(plural)]
    
    def get_prop_trans(self, property, lang):
        from .translations import properties, choices
        return (properties.get(property) or choices.get(property))[lang]

    def get_prop_by_trans(self, trans, lang=RU):
        from .translations import properties, choices
        
        for prop, tranlation in properties.items():
            if tranlation[lang] == trans:
                return prop
        
        for prop, tranlation in choices.items():
            if tranlation[lang] == trans:
                return prop