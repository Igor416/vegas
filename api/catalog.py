#Products
MATTRASS = 'Mattrass'
PILLOW = 'Pillow'
MATTRASSPAD = 'MattrassPad'
BLANKET = 'Blanket'
BEDSHEETS = 'BedSheets'
BED = 'Bed'
STAND= 'Stand'
BASIS = 'Basis'

#Properties
MATTRASS_TYPE = 'mattrass_type'
COLLECTION = 'collection'
CONSTRUCTION = 'construction'
RIGIDITY = 'rigidity'
SPRINGBLOCK = 'springblock'
AGE = 'age'
PACKAGE = 'package'
MATERIAL_FILLER = 'material_filler'
COVER = 'cover'
MATTRASSPAD_TYPE = 'mattrasspad_type'
BINDING = 'binding'
BLANKET_TYPE = 'blanket_type'
BLANKET_COLOR = 'blanket_color'
FILLING = 'filling'
BEDSHEETS_TYPE = 'bedsheets_type'
BEDSHEETS_COLOR = 'bedsheets_color'
TISSUE = 'tissue'
BED_TYPE = 'bed_type'
MATERIAL = 'material'
BASIS_TYPE = 'basis_type'

COMMON_PROPERTIES  = {
    AGE: [MATTRASS, PILLOW, BLANKET],
    PACKAGE: [MATTRASS, BLANKET, BEDSHEETS],
    COVER: [PILLOW, MATTRASSPAD]
}

CATALOG = {
    MATTRASS: [MATTRASS_TYPE, COLLECTION, CONSTRUCTION, RIGIDITY, SPRINGBLOCK],
    PILLOW: [MATERIAL_FILLER,],
    MATTRASSPAD: [MATTRASSPAD_TYPE, BINDING],
    BLANKET: [BLANKET_TYPE, BLANKET_COLOR, FILLING],
    BEDSHEETS: [BEDSHEETS_TYPE, BEDSHEETS_COLOR, TISSUE],
    BED: [BED_TYPE],
    STAND: [MATERIAL],
    BASIS: [BASIS_TYPE]
}

from .translations import RU, RO
class Manager:
    def get_pr_choices(self):
        return [(key, self.get_pr_trans(key)) for key in CATALOG.keys()]

    def get_prop_choices(self):
        choices = [
            ('ОБЩИЕ', 'ОБЩИЕ')
        ]

        for prop in COMMON_PROPERTIES.keys():
            choices.append((prop, self.get_prop_trans(prop, RU)))

        for pr, props in CATALOG.items():
            choices.append(('', ''))
            choices.append((pr, 'ТОЛЬКО ' + self.get_pr_trans(pr).upper()))
            for prop in props:
                choices.append((prop, self.get_prop_trans(prop)))
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
    
    def get_pr_trans(self, product, plural=False, lang=RU):
        from .translations import products
        return products.get(product)[lang][int(plural)]
    
    def get_prop_trans(self, property, lang=RU):
        from .translations import properties
        return properties.get(property)[lang]