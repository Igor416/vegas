from django.urls import path
from .views import SearchView, BestView, CategoryView, ProductsView, ProductDetailView

urlpatterns = [
    path('search/', SearchView.as_view()),
    path('best/', BestView.as_view()),
    path('category/<str:name>/', CategoryView.as_view()),
    path('products/<str:product>/<str:category>/', ProductsView.as_view()),
    path('products/<str:product>/<str:category>/<str:filter>/', ProductsView.as_view()),
    path('product/<str:product>/<int:id>/', ProductDetailView.as_view())
]
