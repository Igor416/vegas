from enum import Enum
from . import catalog as ct

EN = 0
RU = 1
RO = 2

products = {
    ct.MATTRESS: ((('Mattress', 'Mattresses'), ('Матрас', 'Матрасы'), ('Saltea', 'Saltele'))),
    ct.PILLOW: ((('Pillow', 'Pillows'), ('Подушка', 'Подушки'), ('Perna', 'Perne'))),
    ct.MATTRESSPAD: ((('Mattress Pad', 'Mattress Pads'), ('Наматрасник', 'Наматрасники'), ('Husa', 'Huse'))),
    ct.BLANKET: ((('Blanket', 'Blankets'), ('Одеяло', 'Одеяла'), ('Plapuma', 'Plapume'))),
    ct.BEDSHEETS: ((('Bed Sheets', 'Bed Sheets'), ('Постельное белье', 'Постельно белье'), ('Cearceafuri', 'Cearceafuri'))),
    ct.BED: ((('Bed', 'Beds'), ('Кровать', 'Кровати'), ('Pat', 'Paturi'))),
    ct.STAND: ((('Stand', 'Stands'), ('Тумба', 'Тумбы'), ('Noptiera', 'Noptiere'))),
    ct.BASIS: ((('Basis', 'Basises'), ('Основание', 'Основания'), ('Somiera', 'Somiere')))
}

properties = {
    ct.MATTRESS_TYPE: ('Mattress Type', 'Тип матраса', 'Tip de saltea'),
    ct.COLLECTION: ('Collection', 'Коллекция', 'Colecție'),
    ct.CONSTRUCTION: ('Construction', 'Конструкция', 'Construcție'),
    ct.RIGIDITY: ('Rigidity level of side', 'Уровень жесткости стороны', 'Duritatea laterala'),
    ct.SPRINGBLOCK: ('Spring block', 'Пружинный блок', 'Bloc de Arc'),
    ct.AGE: ('Age Category', 'Для возраста', 'Pentru vârstă'),
    ct.MATERIAL_FILLER: ('Material Filler', 'Материал наполнения', 'Material de umplere'),
    ct.COVER: ('Cover', 'Ткань чехла', 'Material de acoperire'),
    ct.MATTRESSPAD_TYPE: ('Mattress Pad Type', 'Тип наматрасника', 'Tip de husă'),
    ct.BINDING: ('Binding', 'Крепление', 'Fixare'),
    ct.BLANKET_TYPE: ('Blanket Type', 'Тип одеяла', 'Tip de plapumă'),
    ct.BLANKET_COLOR: ('Blanket Color', 'Цвет одеяла', 'Culoare de plapumă'),
    ct.FILLING: ('Filling', 'Наполнитель', 'Material de umplutura'),
    ct.BEDSHEETS_TYPE: ('Kit Type', 'Тип комплекта', 'Tip de kit'),
    ct.BEDSHEETS_COLOR: ('Kit color', 'Цвет комплекта', 'Culoare de kit'),
    ct.TISSUE: ('Tissue', 'Ткань', 'țesătură'),
    ct.BED_TYPE: ('Bed Type', 'Вид кровати', 'Tip de pat'),
    ct.MATERIAL: ('Material', 'Материал', 'Material'),
    ct.BASIS_TYPE: ('Basis Type', 'Вид основания', 'Tip de somieră')
}