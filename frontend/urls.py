from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path(r'<string>', index),
    path(r'<string>/<string1>', index),
    path(r'<string>/<string1>/<string2>', index)
]
