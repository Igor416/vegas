from rest_framework.views import APIView
from rest_framework.response import Response
from api.detectors import detect_lang
from api.serializers import StockSerializer
from api import models

class StockView(APIView):
  @detect_lang
  def get(self, request, lang):
    queryset = models.Stock.objects.all()
    serializer = StockSerializer(queryset, lang=lang, many=True)
    return Response(sorted(serializer.data, key=lambda stock: stock['discount'], reverse=True))