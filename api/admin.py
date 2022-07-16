from django.contrib import admin
from . import models
from .catalog import Manager
from .forms import ProductForm

manager = Manager()

admin.site.register(models.Category)
admin.site.register(models.Image)
admin.site.register(models.Video)

@admin.register(models.Size)
class SizeAdmin(admin.ModelAdmin):
    ordering = ['category', 'width']
    exclude = ['category']

@admin.register(models.Choice)
class ChoiceAdmin(admin.ModelAdmin):
    ordering = ['name']
    exclude = ['category']

for product_name in manager.get_all_products():
    form = type(product_name + 'Form', (ProductForm,), {})
    model = getattr(models, product_name)
    model._meta.verbose_name = manager.get_pr_trans(product_name)
    model._meta.verbose_name_plural = manager.get_pr_trans(product_name, True)
    setattr(form, 'model', model)
    admin_model = type(product_name + 'Admin', (admin.ModelAdmin,), {'form': form})
    admin.site.register(model, admin_model)

