from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CategorySerializer, create_serializer
from .translations import EN, RU, RO
from . import models

langs = {
    'en': EN,
    'ru': RU,
    'ro': RO
}

class CategoryView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request, name):
        lang = request.GET.get(self.lookup_url_kwarg).lower()
        category = models.Category.objects.get(name=name)

        serializer = CategorySerializer(lang, category)
        return Response(serializer.data)

class ProductsView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request, product, category, filter=None):
        lang = request.GET.get(self.lookup_url_kwarg).lower()
        model = getattr(models, product.title())

        filter = filter.replace('_', ' ') if filter else None
        queryset = model.objects.get_filtered(category, filter)
        
        serializer = create_serializer(model, lang)(queryset, many=True)
        return Response(serializer.data)
