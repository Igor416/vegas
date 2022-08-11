from rest_framework.generics import ListAPIView, ListCreateAPIView
from .serializers import BannerSerializer, ReviewSerializer
from .models import Banner, Review

# Create your views here.
class BannerView(ListAPIView):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer

class ReviewView(ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer