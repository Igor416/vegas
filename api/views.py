from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from . import serializers, models

class ProductView(APIView):
    def get(self, request):
        #user = User.objects.get(id=payload['id'])
        #serializer = UserSerializer(user)
        return Response(None)