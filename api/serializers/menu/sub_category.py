from rest_framework.serializers import ModelSerializer
from api import models
from ..category import CategorySerializer
from .filter import MenuFilterSerializer

class MenuSubCategorySerializer(ModelSerializer):
  category = CategorySerializer()
  filters = MenuFilterSerializer(many=True)
  
  class Meta:
    exclude = ['id', 'menu_category', 'products', 'order']
    model = models.MenuSubCategory