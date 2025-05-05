from rest_framework.generics import ListAPIView
from api.serializers import ListedProductSerializer
from api.models import Product, Size

class SalesView(ListAPIView):
  serializer_class = ListedProductSerializer
  queryset = Product.objects.filter(category__disabled=False, id__in=Size.objects.filter(on_sale=True).values_list('product', flat=True).distinct())