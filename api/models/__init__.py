from django.db import models
from api import catalog
from api.translations import EN, RU, RO

def create_related_field(prop, multiple=False, plural=False):
	kwargs = {
		'to': 'Choice',
		'related_name': prop + ('%(class)s' if multiple else '')
	}

	if plural:
		field = models.ManyToManyField
	else:
		field = models.ForeignKey
		kwargs.update({'on_delete': models.SET_NULL, 'null': True})

	return field(**kwargs)

def save_langs(val_en, val_ru, val_ro):
	val_ru = val_ru.strip()
	if val_en == '':
		val_en = val_ru
	else:
		val_en = val_en.strip()
	if val_ro == '':
		val_ro = val_ru
	else:
		val_ro = val_ro.strip()

	return val_en, val_ru, val_ro

def has_multiple_rels(model, field):
	if field == 'rigidity':
		return False
	return hasattr(getattr(model, field), 'rel')

from .category import Category
from .choice import Choice
from .size import Size, BedSheetsSize
from .files import Image, Video
from .technologies import Technology, LayerMattress, LayerPillow, LayerMattressPad
from .marker import Marker
from .products import Mattress, Pillow, MattressPad, Blanket, BedSheets, Bed, Stand, Basis
from .stock import Stock