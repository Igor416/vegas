from rest_framework.views import APIView
from rest_framework.response import Response
from api import models

class WorkerView(APIView):
  def get(self, request):
    return Response()