from django.urls import path
from .views import BannerView, ReviewView

urlpatterns = [
    path('', BannerView.as_view()),
    path('reviews/', ReviewView.as_view()),
]
