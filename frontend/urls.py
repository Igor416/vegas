from django.urls import path
from django.conf.urls.static import static
from vegas.settings import BASE_DIR
from .views import index

urlpatterns = [
    path('', index),
    path(r'cart', index),
    path(r'shops', index),
    path(r'catalog/<string1>/<string2>', index),
    path(r'catalog/<string1>/<string2>/<string3>', index),
    path(r'product/<string1>/<string2>', index),
]

urlpatterns += static('/public/locales/dev/', document_root=BASE_DIR.joinpath('frontend/public/locales/en'))
urlpatterns += static('/public/', document_root=BASE_DIR.joinpath('frontend/public'))