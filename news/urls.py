from django.urls import path
from .views import BannerView, ReviewView

urlpatterns = [
    path('banners/', BannerView.as_view()),
    path('reviews/', ReviewView.as_view()),
]
