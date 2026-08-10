from rest_framework.generics import ListAPIView

from api import models
from api.serializers import DetailedCategorySerializer


class CategoriesView(ListAPIView):
    queryset = models.Category.objects.filter(disabled=False)
    serializer_class = DetailedCategorySerializer
