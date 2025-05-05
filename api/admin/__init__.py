from django.contrib import admin
from api.models import Category, BedSheetsSizeAddition, CollectionPrice

admin.site.register((Category, BedSheetsSizeAddition, CollectionPrice))

from .characteristic_type import CharacteristicTypeAdmin
from .characteristic import StringCharacteristicAdmin, IntegerCharacteristicAdmin, BooleanCharacteristicAdmin
from .size import SizeAdmin
from .file import ImageAdmin, VideoAdmin
from .technology import TechnologyAdmin
from .product import ProductAdmin
from .menu import MenuCategoryAdmin, MenuSubCategoryAdmin, MenuFilterAdmin