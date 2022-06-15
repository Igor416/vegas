from django.contrib import admin
from .models import Product, Choice, Mattrass, Furniture

class ChoiceAdmin(admin.ModelAdmin):
    filter_horizontal = ('name',)

admin.site.register(Product)
admin.site.register(Choice)
admin.site.register(Mattrass)
admin.site.register(Furniture)
