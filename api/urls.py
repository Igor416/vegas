from django.urls import path
from .views import CategoryView, ProductsView, ProductDetailView

urlpatterns = [
    path('category/<str:name>/', CategoryView.as_view()),
    path('products/<str:product>/<str:category>/', ProductsView.as_view()),
    path('products/<str:product>/<str:category>/<str:filter>/', ProductsView.as_view()),
    path('product/<str:product>/<int:id>/', ProductDetailView.as_view())
]
