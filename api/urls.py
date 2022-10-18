from django.urls import path
from .views import SearchView, BestView, MattressColectionsPriceView, CategoryView, ProductsView, ProductDetailsView, WorkerView

urlpatterns = [
    path('search/', SearchView.as_view()),
    path('best/', BestView.as_view()),
    path('mattress_category_prices/', MattressColectionsPriceView.as_view()),
    path('category/<str:category>/', CategoryView.as_view()),
    path('products/<str:product>/<str:category>/', ProductsView.as_view()),
    path('products/<str:product>/<str:category>/<str:filter>/', ProductsView.as_view()),
    path('product/<str:product>/<int:id>/', ProductDetailsView.as_view())
]
