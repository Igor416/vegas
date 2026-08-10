from rest_framework.generics import ListAPIView

from api import models
from api.serializers import MenuCategorySerializer


class MenuView(ListAPIView):
    queryset = models.MenuCategory.objects.all()
    serializer_class = MenuCategorySerializer
