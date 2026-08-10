from rest_framework.serializers import ModelSerializer

from api import models

from ..size import SizeWithProductSerializer
from .sub_category import MenuSubCategorySerializer


class MenuCategorySerializer(ModelSerializer):
    sizes = SizeWithProductSerializer(many=True)
    sub_categories = MenuSubCategorySerializer(many=True)

    class Meta:
        exclude = ("id", "order")
        model = models.MenuCategory
