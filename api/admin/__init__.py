from django.contrib import admin
from api.models import BedSheetsSizeAddition, CollectionPrice

admin.site.register((BedSheetsSizeAddition, CollectionPrice))

from .category import CategoryAdmin
from .characteristic_type import CharacteristicTypeAdmin
from .characteristic import StringCharacteristicAdmin, IntegerCharacteristicAdmin, BooleanCharacteristicAdmin
from .size import SizeAdmin
from .file import ImageAdmin, VideoAdmin
from .technology import TechnologyAdmin
from .product import ProductAdmin
from .menu import MenuCategoryAdmin, MenuSubCategoryAdmin, MenuFilterAdmin