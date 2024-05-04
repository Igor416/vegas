from rest_framework.views import APIView
from rest_framework.response import Response
from api.detectors import detect_country
from api.serializers import MattressCollectionsPriceSerializer
from api import models

class MattressCollectionsPriceView(APIView):
  @detect_country
  def get(self, request, country):
    queryset = models.Choice.objects.filter(name='collection')
    serializer = MattressCollectionsPriceSerializer(queryset, country=country, many=True)
    return Response(serializer.data)