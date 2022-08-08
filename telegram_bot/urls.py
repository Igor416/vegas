from django.urls import path
from .views import OrderView, OrderCallView

urlpatterns = [
    path('order/', OrderView.as_view()),
    path('order_call/', OrderCallView.as_view()),
]
