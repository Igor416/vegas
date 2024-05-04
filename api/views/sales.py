from rest_framework.views import APIView
from rest_framework.response import Response
from api.detectors import detect_lang, detect_country
from api.serializers import ListedProductsSerializerFactory
from api.translations import sales, get_lang
from api import models

class SalesView(APIView):
  @detect_country
  @detect_lang
  def get(self, request, lang, country):
    sizes = [s for s in models.Size.objects.all() if s.on_sale]
    resp = []
    for s in sizes:
      if s.category:
        model = getattr(models, s.category.name)
        queryset = model.objects.get_by_name(s.product)
        data = ListedProductsSerializerFactory(model, lang, country).create(queryset, country=country, lang=lang).data
        resp.append(data)

    return Response({'products': resp, 'name_s': sales['name_s'][get_lang(lang)], 'name_pl': sales['name_pl'][get_lang(lang)]})