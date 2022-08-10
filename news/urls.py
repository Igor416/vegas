from django.urls import path
from .views import BannerView

urlpatterns = [
    path('', BannerView.as_view()),
]
