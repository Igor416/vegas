from rest_framework.generics import ListAPIView
from api.serializers import DetailedCategorySerializer
from api import models

class CategoriesView(ListAPIView):
  queryset = models.Category.objects.filter(disabled=False)
  serializer_class = DetailedCategorySerializer