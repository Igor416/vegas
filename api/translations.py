from . import catalog as ct

langs = ['en', 'ru', 'ro']

EN = 0
RU = 1
RO = 2

def get_lang(lang):
	return langs.index(lang)

products = {
	ct.MATTRESS: (('Mattress', 'Mattresses'), ('Матрас', 'Матрасы'), ('Saltea', 'Saltele')),
	ct.PILLOW: (('Pillow', 'Pillows'), ('Подушка', 'Подушки'), ('Perna', 'Perne')),
	ct.MATTRESSPAD: (('Mattress Pad', 'Mattress Pads'), ('Наматрасник', 'Наматрасники'), ('Husa', 'Huse')),
	ct.BLANKET: (('Blanket', 'Blankets'), ('Одеяло', 'Одеяла'), ('Plapuma', 'Plapume')),
	ct.BEDSHEETS: (('Bed Sheets Kit', 'Bed Sheets Kit'), ('Комплект постельного белья', 'Комплекты постельного белья'), ('Cearceafuri', 'Cearceafuri')),
	ct.BED: (('Bed', 'Beds'), ('Кровать', 'Кровати'), ('Pat', 'Paturi')),
	ct.STAND: (('Stand', 'Stands'), ('Тумба', 'Тумбы'), ('Noptiera', 'Noptiere')),
	ct.BASIS: (('Basis', 'Basises'), ('Основание', 'Основания'), ('Somiera', 'Somiere'))
}

properties = {
	ct.HEIGHT: ('Height (cm)', 'Высота (см)', 'Înălţime (cm)'),
	ct.SPRINGS: ('Number of springs', 'Количество пружин', 'Numărul de arcuri'),
	ct.MAX_PRESSURE: ('Maximum load per bed (kg)', 'Максимальная нагрузка на 1 спальное место (кг)', 'Sarcina maxima pe pat (kg)'),
	ct.LIFETIME: ('Life time (years)', 'Срок службы (лет)', 'Durata de viață (ani)'),
	ct.CASE: ('Removable cover', 'Съемный чехол', 'Husa detasabila'),
	ct.DENSITY: ('Filling density (g/m2)', 'Плотность наполнителя (г/м2)', 'Densitatea de umplere (g/m2)'),
	ct.HEADBOARD_HEIGHT: ('Headboard height (cm)', 'Высота изголовья (см)', 'Înălțimea tăbliei (cm)'),
	ct.EXTRA_LENGTH: ('Bed dimensions - length (cm)', 'Габариты кровати - длина (см)', 'Bed dimensions - lungime (cm)'),
	ct.EXTRA_WIDTH: ('Bed dimensions - width (cm)', 'Габариты кровати - ширина (см)', 'Bed dimensions - lăţime (cm)'),
	ct.DISTANCE: ('Distance between slats (cm)', 'Расстояние между ламелями (см)', 'Distanța dintre lamele (cm)'),
	ct.WIDTH: ('Width slats (cm)', 'Ширина ламели (см)', 'Lamele latime (cm)'),
	ct.LEGS_HEIGHT: ('Leg height (cm)', 'Высота ножек (см)', 'Înălțimea piciorului (cm)'),
	ct.RECOMENDED: ('Recommended for mattresses', 'Рекомендовано для матрассов', 'Reco чехлаmandat pentru saltele')
}

choices = {
	ct.MATTRESS_TYPE: ('Mattress Type', 'Тип матраса', 'Tip de saltea'),
	ct.COLLECTION: ('Collection', 'Коллекция', 'Colecție'),
	ct.CONSTRUCTION: ('Construction', 'Конструкция', 'Construcție'),
	ct.RIGIDITY: ('Rigidity level of side', 'Уровень жесткости стороны', 'Duritatea laterala'),
	ct.SPRINGBLOCK: ('Spring block', 'Пружинный блок', 'Bloc de Arc'),
	ct.AGE: ('Age Category', 'Для возраста', 'Pentru vârstă'),
	ct.MATERIAL_FILLER: ('Material Filler', 'Материал наполнения', 'Material de umplere'),
	ct.COVER: ('Cover', 'Ткань чехла', 'Material de acoperire'),
	ct.MATTRESSPAD_TYPE: ('Mattress Pad Type', 'Тип наматрасника', 'Tip de husă'),
	ct.BINDING: ('Contour', 'Крепление', 'Contur'),
	ct.BLANKET_TYPE: ('Blanket Type', 'Тип одеяла', 'Tip de plapumă'),
	ct.BLANKET_COLOR: ('Blanket Color', 'Цвет одеяла', 'Culoare de plapumă'),
	ct.FILLING: ('Filling', 'Наполнитель', 'Material de umplutura'),
	ct.BEDSHEETS_TYPE: ('Kit Type', 'Тип комплекта', 'Tip de kit'),
	ct.BEDSHEETS_COLOR: ('Kit color', 'Цвет комплекта', 'Culoare de kit'),
	ct.TISSUE: ('Tissue', 'Ткань', 'țesătură'),
	ct.BED_TYPE: ('Bed Type', 'Вид кровати', 'Tip de pat'),
	ct.MATERIAL: ('Material', 'Материал', 'Material')
}

sales = {
	'name_s': ('Sale', 'Распродажа', 'Vânzăre'),
	'name_pl': ('Sales', 'Распродажи', 'Vânzări')
}