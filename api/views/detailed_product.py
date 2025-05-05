from rest_framework.generics import RetrieveAPIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from api.serializers import DetailedProductSerializer, CharacteristicTypeSerializer
from api.serializers import BooleanCharacteristicSerializer, IntegerCharacteristicSerializer, StringCharacteristicSerializer
from api.models import Product

class DetailedProductView(RetrieveAPIView):
  serializer_class = DetailedProductSerializer
  queryset = Product.objects.select_related('category').prefetch_related(
    'sizes',
    'boolean_characteristics',
    'integer_characteristics',
    'string_characteristics',
    'category__characteristic_types'
  ).filter(category__disabled=False)
  
  def get(self, request, category, name):
    product = get_object_or_404(
      self.queryset,
      category__name=category, name_en=name
    )
    
    data = self.serializer_class(product).data
    
    data.update({'characteristics': []})
    mapping = {
      'B': (product.boolean_characteristics.all(), BooleanCharacteristicSerializer),
      'I': (product.integer_characteristics.all(), IntegerCharacteristicSerializer),
      'S': (product.string_characteristics.all(), StringCharacteristicSerializer)
    }
    for characteristic_type in product.category.characteristic_types.all():
      queryset, serializer_class = mapping[characteristic_type.data_type]
      filtered_queryset = queryset.filter(type=characteristic_type)
      characteristic_data = {
        'type': CharacteristicTypeSerializer(characteristic_type).data,
      }
      if filtered_queryset.count() == 1:
        serializer = serializer_class(filtered_queryset.first())
        characteristic_data.update(serializer.data)
      else:
        serializer = serializer_class(filtered_queryset, many=True)
        characteristic_data.update({'value': [{key.replace('value_', ''): value for key, value in entry.items()} for entry in serializer.data]})
      
      data['characteristics'].append(characteristic_data)
    return Response(data)