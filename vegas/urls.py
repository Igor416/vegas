from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('telegram/', include('telegram_bot.urls')),
    path('api/', include('api.urls')),
] + static(settings.STATIC_URL, document_root = settings.STATIC_ROOT)  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns.append(path('', include('frontend.urls')))