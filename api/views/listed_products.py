from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404
from api.serializers import ListedProductSerializer
from api.models import Category, MenuSubCategory

class ListedProductsView(ListAPIView):
  serializer_class = ListedProductSerializer
  
  def get_queryset(self):
    category_name = self.kwargs.get('category')
    sub_category_val = self.kwargs.get('sub_category')
    filter_val = self.kwargs.get('filter')

    category_obj = get_object_or_404(Category, name=category_name)
    sub_category_obj = get_object_or_404(
      MenuSubCategory.objects.prefetch_related('products', 'filters__products'),
      category=category_obj, value=sub_category_val
    )

    if filter_val:
      product_filter = get_object_or_404(sub_category_obj.filters, value=filter_val)
      queryset = product_filter.products.all()
    else:
      queryset = sub_category_obj.products.all()

    return queryset.exclude(sizes__isnull=True)