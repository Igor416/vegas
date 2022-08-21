from django.contrib import admin
from django.forms import ModelMultipleChoiceField
from . import models
from .catalog import Manager
from .forms import ProductForm
from .translations import RU

manager = Manager()

@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    fields = ['name', 'desc_en', 'desc_ru', 'desc_ro']

@admin.register(models.Choice)
class ChoiceAdmin(admin.ModelAdmin):
    ordering = ['name']
    exclude = ['category']

admin.site.register(models.Technology)

@admin.register(models.Size)
class SizeAdmin(admin.ModelAdmin):
    exclude = ['category']
    ordering = ['category', 'width']

admin.site.register(models.Image)

@admin.register(models.Video)
class VideoAdmin(admin.ModelAdmin):
    fields = ['video_id']

class LayerMattressInline(admin.TabularInline):
    model = models.LayerMattress
    extra = 3

class LayerPillowInline(admin.TabularInline):
    model = models.LayerPillow
    extra = 3

class LayerMattressPadInline(admin.TabularInline):
    model = models.LayerMattressPad
    extra = 3

admin.site.register(models.Marker)

for product_name in manager.get_all_products():
    form = type(product_name + 'Form', (ProductForm,), {})
    model = getattr(models, product_name)
    model._meta.verbose_name = manager.get_pr_trans(product_name, RU, False)
    model._meta.verbose_name_plural = manager.get_pr_trans(product_name, RU, True)
    setattr(form, 'model', model)
    admin_model = type(product_name + 'Admin', (admin.ModelAdmin,), {'form': form, 'exclude': ['markers']})

    if model is models.Mattress:
        setattr(admin_model, 'inlines', (LayerMattressInline, ))
    elif model is models.Pillow:
        setattr(admin_model, 'inlines', (LayerPillowInline, ))
    elif model is models.MattressPad:
        setattr(admin_model, 'inlines', (LayerMattressPadInline, ))
        
    admin.site.register(model, admin_model)

