from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import BestProductSerializerFactory, SizeSerializer
from api.detectors import detect_lang, detect_country
from api import models, catalog as ct

class BestView(APIView):
  @detect_country
  @detect_lang
  def get(self, request, lang, country):
    products, sizes = ct.get_best()
    resp = []
    
    for vals in products:
      row = []
      for model, name in vals:
        model = getattr(models, model)
        queryset = model.objects.get_by_name(name)
        serializer = BestProductSerializerFactory(model, lang, country).create(queryset, country=country, lang=lang)
        row.append(serializer.data)
      resp.append(row)

    for i, base, size in zip(range(len(sizes)), resp[-1], sizes):
      width, length = size
      queryset = models.Size.objects.get(product=base['name'], width=width, length=length)
      resp[-1][i]['size'] = SizeSerializer(queryset, country=country).data

    return Response(resp)