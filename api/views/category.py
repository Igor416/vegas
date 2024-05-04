from rest_framework.views import APIView
from rest_framework.response import Response
from api.detectors import detect_lang
from api.serializers import CategorySerializer
from api import models

class CategoryView(APIView):
  @detect_lang
  def get(self, request, lang):
    queryset = models.Category.objects.exclude(desc_en='')
    serializer = CategorySerializer(queryset, lang=lang, many=True)
    return Response(serializer.data)