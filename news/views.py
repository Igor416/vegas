from rest_framework.generics import ListAPIView, ListCreateAPIView

from .models import Banner, Review
from .serializers import BannerSerializer, ReviewSerializer


# Create your views here.
class BannerView(ListAPIView):
    queryset = Banner.objects.order_by("-id")
    serializer_class = BannerSerializer


class ReviewView(ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
