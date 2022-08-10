from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from .serializers import CategorySerializer, create_list_serializer, create_detail_serializer
from .translations import EN, RU, RO
from . import models

langs = {
    'en': EN,
    'ru': RU,
    'ro': RO
}

class CategoryView(RetrieveAPIView):
    lookup_field = 'name'
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = models.Category.objects.filter(name=self.kwargs.get('name'))
        return queryset

class ProductsView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request, product, category, filter=None):
        lang = request.GET.get(self.lookup_url_kwarg)
        model = getattr(models, product.title())

        filter = filter.replace('_', ' ') if filter else None
        queryset = model.objects.get_filtered(category, filter)
        serializer = create_list_serializer(model, lang)(queryset, many=True)
        return Response(serializer.data)

class ProductDetailView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request, product, id):
        lang = request.GET.get(self.lookup_url_kwarg)
        model = getattr(models, product.title())

        queryset = model.objects.get(id=id)
        serializer = create_detail_serializer(model, lang)(queryset)
        return Response(serializer.data)
