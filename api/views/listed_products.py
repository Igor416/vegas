from rest_framework.views import APIView
from rest_framework.response import Response
from api.detectors import detect_lang, detect_country
from api.serializers import ListedProductsSerializerFactory
from api import models

class ListedProductsView(APIView):
  @detect_country
  @detect_lang
  def get(self, request, lang, country, category, sub_category, filter=None):
    model = getattr(models, category)
    filter = filter.replace('_', ' ') if filter else None
    queryset = model.objects.get_filtered(sub_category, filter)
    serializer = ListedProductsSerializerFactory(model, lang, country).create(queryset, country=country, lang=lang, many=True)
    return Response(serializer.data)