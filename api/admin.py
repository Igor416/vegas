from django.contrib import admin
from . import models
from .catalog import Manager
from .forms import ProductForm, BedSheetsSizesForm
from .translations import RU

manager = Manager()

@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    fields = ['name', 'desc_en', 'desc_ru', 'desc_ro']

@admin.register(models.Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_filter = ('category',)
    ordering = ['name']
    exclude = ['category']

@admin.register(models.Technology)
class TechnologAdmin(admin.ModelAdmin):
    ordering = ['name_ru']

@admin.register(models.Size)
class SizeAdmin(admin.ModelAdmin):
    list_filter = ('category', 'product')
    exclude = ['category', 'product']
    ordering = ['category', 'product', 'length', 'priceEUR']

class ImageListFilter(admin.SimpleListFilter):
    title = ('категориям')
    parameter_name = 'category'

    def lookups(self, request, model_admin):
        return [(product_name, manager.get_pr_trans(product_name, 1, True)) for product_name in manager.get_all_products()]

    def queryset(self, request, queryset):
        if self.value():
            images = []
            for i in queryset.all():
                if len(getattr(models, self.value()).objects.filter(name=i.get_name().replace('_', ' '))) != 0:
                    images.append(i)
                if len(images) != 0:
                    if i.get_name().startswith(images[-1].get_name().split('_')[0]):
                        images.append(i)

            return queryset.filter(id__in=[i.id for i in images]).reverse()

@admin.register(models.Image)
class ImageAdmin(admin.ModelAdmin):
    list_filter = (ImageListFilter, )

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

@admin.register(models.BedSheetsSize)
class BedSheetsSizeAdmin(admin.ModelAdmin):
    form = BedSheetsSizesForm
    exclude = ['category', 'product']
    ordering = ['category', 'product', 'length', 'priceEUR']

@admin.action(description='Mark as best products')
def set_best(modeladmin, request, queryset):
    queryset.update(best=True)

@admin.action(description='Unmark best products')
def unset_best(modeladmin, request, queryset):
    queryset.update(best=False)

@admin.action(description='Remove discount')
def remove_discount(modeladmin, request, queryset):
    queryset.update(discount=0)

for product_name in manager.get_all_products():
    form = type(product_name + 'Form', (ProductForm,), {})
    model = getattr(models, product_name)
    model._meta.verbose_name = f'{manager.get_pr_trans(product_name, RU, False)}'
    model._meta.verbose_name_plural = manager.get_pr_trans(product_name, RU, True)
    setattr(form, 'model', model)

    if model is models.BedSheets:
        ordering = [manager.get_default_filtering(product_name), 'name_ru']
    elif model is models.Basis:
        ordering = ['name']
    else:
        ordering = [manager.get_default_filtering(product_name), 'name']
        
    attrs = {
        'form': form,
        'exclude': ['markers'],
        'ordering': ordering,
        'actions': [set_best, unset_best, remove_discount]
    }

    admin_model = type(product_name + 'Admin', (admin.ModelAdmin,), attrs)

    if model is models.Mattress:
        setattr(admin_model, 'inlines', (LayerMattressInline, ))
    elif model is models.Pillow:
        setattr(admin_model, 'inlines', (LayerPillowInline, ))
    elif model is models.MattressPad:
        setattr(admin_model, 'inlines', (LayerMattressPadInline, ))
        
    admin.site.register(model, admin_model)

