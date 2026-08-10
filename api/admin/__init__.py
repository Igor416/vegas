from django.contrib import admin

from api.models import BedSheetsSizeAddition, CollectionPrice

admin.site.register((BedSheetsSizeAddition, CollectionPrice))

from .category import CategoryAdmin
from .characteristic import (
    BooleanCharacteristicAdmin,
    IntegerCharacteristicAdmin,
    StringCharacteristicAdmin,
)
from .characteristic_type import CharacteristicTypeAdmin
from .file import ImageAdmin, VideoAdmin
from .menu import MenuCategoryAdmin, MenuFilterAdmin, MenuSubCategoryAdmin
from .product import ProductAdmin
from .size import SizeAdmin
from .technology import TechnologyAdmin

__all__ = [
    "BooleanCharacteristicAdmin",
    "CategoryAdmin",
    "CharacteristicTypeAdmin",
    "ImageAdmin",
    "IntegerCharacteristicAdmin",
    "MenuCategoryAdmin",
    "MenuFilterAdmin",
    "MenuSubCategoryAdmin",
    "ProductAdmin",
    "SizeAdmin",
    "StringCharacteristicAdmin",
    "TechnologyAdmin",
    "VideoAdmin",
]
