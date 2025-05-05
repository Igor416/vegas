from rest_framework.generics import ListAPIView
from api.serializers import MenuCategorySerializer
from api import models
  
class MenuView(ListAPIView):
  queryset = models.MenuCategory.objects.all()
  serializer_class = MenuCategorySerializer