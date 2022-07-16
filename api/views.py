from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import create_serializer, CategorySerializer
from json import dumps
from . import models

class CategoryView(APIView):
    def get(self, request, name):
        obj = models.Category.objects.get(name=name)
        serializer = CategorySerializer(obj)
        return Response(serializer.data)


class ProductsView(APIView):
    def get(self, request, product, category, filter=None):
        print(product, category, filter)
        model = getattr(models, product.title())
        model.set_manager()

        if filter == None:
            queryset = model.objects.get_all()
        else:
            filter = filter.replace('_', ' ')
            queryset = getattr(model.objects, 'get_by_' + category)(filter)
        
        serializer = create_serializer(model)(queryset, many=True)
        return Response(serializer.data)
