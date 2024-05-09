from django.urls import path
from . import views

urlpatterns = [
  path('worker/', views.WorkerView.as_view())
]
