from django.urls import path
from django.conf.urls.static import static
from .views import index

urlpatterns = [
    path('', index),
    path('cart', index),
    path('shops', index),
    path('sales', index),
    path('stock', index),
    path('catalog/<string1>/<string2>', index),
    path('catalog/<string1>/<string2>/<string3>', index),
    path('product/<string1>/<string2>', index)
]