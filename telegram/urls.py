from django.urls import path
from .views import OrderCall

urlpatterns = [
    path('orderCall/', OrderCall.as_view()),
]
