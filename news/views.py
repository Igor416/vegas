from rest_framework.generics import ListAPIView
from .serializers import BannerSerializer
from .models import Banner

# Create your views here.
class BannerView(ListAPIView):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer