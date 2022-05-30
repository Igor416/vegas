from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('vegas_api.urls')),
    path('', include('frontend.urls')),
] + static(settings.STATIC_URL, document_root = settings.STATIC_ROOT)
