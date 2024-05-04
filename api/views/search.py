from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import CategoryResultSerializer, ProductResultSerializer
from api.detectors import detect_lang, detect_country
from api.search import search_categories, search_products

class SearchView(APIView):
  @detect_country
  @detect_lang
  def post(self, request, lang, country):
    search = request.data['search']
    categories_serializer = CategoryResultSerializer(search_categories(search, lang), lang=lang, many=True)

    products_data = []
    for queryset in search_products(search, lang):
      if queryset.exists():
        products_data.extend(ProductResultSerializer(queryset, country=country, lang=lang, many=True).data)

    return Response({'categories': categories_serializer.data, 'products': products_data})