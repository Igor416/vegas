from django.urls import path
from .views import OrderCallView

urlpatterns = [
    path('order_call/', OrderCallView.as_view()),
]
