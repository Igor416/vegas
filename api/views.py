from urllib import response
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from . import serializers, models

class ProductsView(APIView):
    def get(self, request):
        response = models.Choice.objects.all_categories()
        #serializer = 'lol'#UserSerializer(user)
        return Response(response)

class CategoryView(APIView):
    def get(self, request):
        serializer = 'lol'
        return Response(serializer)