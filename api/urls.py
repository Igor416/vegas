from django.urls import path
from . import views

urlpatterns = [
    path('search/', views.SearchView.as_view()),
    path('best/', views.BestView.as_view()),
    path('mattress_category_prices/', views.MattressColectionsPriceView.as_view()),
    path('category/<str:category>/', views.CategoryView.as_view()),
    path('products/<str:product>/<str:category>/', views.ProductsView.as_view()),
    path('products/<str:product>/<str:category>/<str:filter>/', views.ProductsView.as_view()),
    path('product/<str:product>/<int:id>/', views.ProductDetailsView.as_view()),
    path('sales/', views.SalesView.as_view()),
    path('stock/', views.StockView.as_view())
]
