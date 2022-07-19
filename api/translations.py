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
    ct.BEDSHEETS: ((('Bed Sheets', 'Bed Sheets'), ('Постельное белье', 'Постельно белье'), ('Lenjerie de Pat', 'Lenjerie de Pat'))),
    ct.BED: ((('Bed', 'Beds'), ('Кровать', 'Кровати'), ('Pat', 'Paturi'))),
    ct.STAND: ((('Stand', 'Stands'), ('Тумба', 'Тумбы'), ('Noptiera', 'Noptiere'))),
    ct.BASIS: ((('Basis', 'Basises'), ('Основание', 'Основания'), ('Somiera', 'Somiere')))
}

properties = {
    ct.MATTRESS_TYPE: ('Mattress Type', 'Тип матраса', 'Tipul de Saltea'),
    ct.COLLECTION: ('Collection', 'Коллекция', 'Collectie'),
    ct.CONSTRUCTION: ('Construction', 'Конструкция', 'Constructie'),
    ct.RIGIDITY: ('Rigidity level of side', 'Уровень жесткости стороны', 'Duritatea laterala'),
    ct.SPRINGBLOCK: ('Spring block', 'Пружинный блок', 'Bloc de Arc'),
    ct.AGE: ('Age Category', 'Для возраста', 'Pentru varsta'),
    ct.PACKAGE: ('Package', 'Упаковка', 'Ambalare'),
    ct.MATERIAL_FILLER: ('Material Filler', 'Материал наполнения', 'Material de Umplere'),
    ct.COVER: ('Cover', 'Ткань чехла', 'Material de Acoperire'),
    ct.MATTRESSPAD_TYPE: ('Mattress Pad Type', 'Тип наматрасника', 'Tipul de Husa'),
    ct.BINDING: ('Binding', 'Крепление', 'Fixare'),
    ct.BLANKET_TYPE: ('Blanket Type', 'Тип одеяла', 'Tipul de Plapume'),
    ct.BLANKET_COLOR: ('Blanket Color', 'Цвет одеяла', 'Culoare de Plapuma'),
    ct.FILLING: ('Filling', 'Наполнитель', 'Material de Umplutura'),
    ct.BEDSHEETS_TYPE: ('Kit Type', 'Тип комплекта', 'Tipul de kit'),
    ct.BEDSHEETS_COLOR: ('Kit color', 'Цвет комплекта', 'Culoare de kit'),
    ct.TISSUE: ('Tissue', 'Ткань', 'tesatura'),
    ct.BED_TYPE: ('Bed Type', 'Вид кровати', 'Tipul de pat'),
    ct.MATERIAL: ('Material', 'Материал', 'Material'),
    ct.BASIS_TYPE: ('Basis Type', 'Вид основания', 'Tipul de Somiera')
}