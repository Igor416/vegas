from django.http import Http404
from rest_framework.generics import RetrieveAPIView
from django.shortcuts import get_object_or_404
from api.serializers import SizeWithShortcutSerializer
from api.models import Size

class SizeView(RetrieveAPIView):
  serializer_class = SizeWithShortcutSerializer
  
  def get_object(self):
    category_name = self.kwargs.get('category')
    product_name = self.kwargs.get('name').replace('%20', ' ')
    width, length = map(int, self.kwargs.get('dimensions').split('x'))
    queryset = Size.objects.filter(product__category__name=category_name, product__name_en=product_name, width=width)
    if queryset.count() == 0:
      raise Http404("No size matches the given query.")
    elif queryset.count() == 1:
      size = queryset.first()
    else:
      size = get_object_or_404(queryset, width=200 if length == 190 else length)
    return size