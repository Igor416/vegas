from rest_framework.views import APIView
from rest_framework.response import Response
from api.models import Size, BedSheetsSize, Mattress
  
class WorkerView(APIView):
  def get(self, request):
    for s in Size.objects.all():
      if s.category.name == 'Mattress':
        if Mattress.objects.get(name=s.product).collection.property_en in ['Smart', 'Alba']:
          continue
      s.priceEUR *= 1.05
      s.save()
    return Response()