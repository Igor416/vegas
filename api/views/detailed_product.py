from rest_framework.views import APIView
from rest_framework.response import Response
from api.detectors import detect_lang, detect_country
from api.serializers import DetailedProductSerializerFactory
from api import models

class DetailedProductView(APIView):
  @detect_country
  @detect_lang
  def get(self, request, lang, country, category, name):
    model = getattr(models, category)
    if model is models.BedSheets:
      queryset = model.objects.filter(name_ru=name) | model.objects.filter(name_en=name) | model.objects.filter(name_ro=name)
      queryset = queryset[0]
    else:
      queryset = model.objects.get(name=name)
    serializer = DetailedProductSerializerFactory(model, lang, country).create(queryset, country=country, lang=lang)
    return Response(serializer.data)