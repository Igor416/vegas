from django.contrib import admin
from api import models
from api.forms import StockForm

@admin.register(models.Stock)
class StockAdmin(admin.ModelAdmin):
  form = StockForm