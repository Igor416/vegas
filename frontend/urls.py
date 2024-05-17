from django.urls import path, re_path
from .views import index, redirect_view

urlpatterns = [
  path('', index),
  path('cart', index),
  path('shops', index),
  path('sales', index),
  path('stock', index),
  path('catalog/<string1>/<string2>', index),
  path('catalog/<string1>/<string2>/<string3>', index),
  path('product/<string1>/<string2>', index),
  re_path(r'^(?P<path>.*)/$', redirect_view)
]