from django.urls import path
from . import views

urlpatterns = [
  path('menu/', views.MenuView.as_view()),
  path('categories/', views.CategoriesView.as_view()),
  path('products/<str:category>/<str:sub_category>/', views.ListedProductsView.as_view()),
  path('products/<str:category>/<str:sub_category>/<str:filter>/', views.ListedProductsView.as_view()),
  path('product/<str:category>/<str:name>/', views.DetailedProductView.as_view()),
  path('size/<str:category>/<str:name>/<str:dimensions>/', views.SizeView.as_view()),
  path('sales/', views.SalesView.as_view()),
  path('worker/', views.WorkerView.as_view())
]
