from django.contrib import admin

from api.models import Product

from .actions import remove_discount, set_best, unset_best
from .characteristic import (
    BooleanCharacteristicInline,
    IntegerCharacteristicInline,
    StringCharacteristicInline,
)
from .file import ImageInline, VideoInline
from .size import SizeInline


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    actions = (set_best, unset_best, remove_discount)
    list_filter = ("category",)
    inlines = (
        SizeInline,
        ImageInline,
        VideoInline,
        StringCharacteristicInline,
        IntegerCharacteristicInline,
        BooleanCharacteristicInline,
    )
