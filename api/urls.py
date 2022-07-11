from django.urls import path
from .views import ProductsView

urlpatterns = [
    path('products/<str:product>/<str:category>/', ProductsView.as_view()),
    path('products/<str:product>/<str:category>/<str:filter>/', ProductsView.as_view())
]
