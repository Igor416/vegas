from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import create_serializer
from . import models

class ProductsView(APIView):
    def get(self, request, product, category, filter=None):
        model = getattr(models, product.title())
        model.set_manager()

        if filter == None:
            queryset = model.objects.get_all()
        else:
            queryset = getattr(model, 'get_by_' + category)(filter)
        
        serializer = create_serializer(model)(queryset, many=True)
        data = serializer.data
        print('received')
        return Response(data)
