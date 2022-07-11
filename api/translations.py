from enum import Enum
from . import catalog as ct

RU = 0
RO = 1

products = {
    ct.MATTRASS: (('Матрас', 'Матрасы'), ),
    ct.PILLOW: (('Подушка', 'Подушки'), ),
    ct.MATTRASSPAD: (('Наматрасник', 'Наматрасники'), ),
    ct.BLANKET: (('Одеяло', 'Одеяла'), ),
    ct.BEDSHEETS: (('Постельное белье', 'Постельно белье'), ),
    ct.BED: (('Кровать', 'Кровати'), ),
    ct.STAND: (('Тумба', 'Тумбы'), ),
    ct.BASIS: (('Основание', 'Основания'), )
}

properties = {
    ct.MATTRASS_TYPE: ('Тип матраса', ),
    ct.COLLECTION: ('Коллекция', ),
    ct.CONSTRUCTION: ('Конструкция', ),
    ct.RIGIDITY: ('Уровень жесткости стороны', ),
    ct.SPRINGBLOCK: ('Пружинный блок', ),
    ct.AGE: ('Для возраста', ),
    ct.PACKAGE: ('Упаковка', ),
    ct.MATERIAL_FILLER: ('Материал наполнения', ),
    ct.COVER: ('Ткань чехла', ),
    ct.MATTRASSPAD_TYPE: ('Тип наматрасника', ),
    ct.BINDING: ('Крепление', ),
    ct.BLANKET_TYPE: ('Тип одеяла', ),
    ct.BLANKET_COLOR: ('Цвет одеяла', ),
    ct.FILLING: ('Наполнитель', ),
    ct.BEDSHEETS_TYPE: ('Тип комплекта', ),
    ct.BEDSHEETS_COLOR: ('Цвет комплекта', ),
    ct.TISSUE: ('Ткань', ),
    ct.BED_TYPE: ('Вид кровати', ),
    ct.MATERIAL: ('Материал', ),
    ct.BASIS_TYPE: ('Вид основания', )
}