from django.contrib import admin
from api import models
from api import catalog as ct
from api.forms import ProductForm
from .actions import set_best, unset_best, remove_discount
from .technologies import LayerMattressInline, LayerPillowInline, LayerMattressPadInline

def create_product_admins():
  for product_name in ct.get_all_categories():
    form = type(product_name + 'Form', (ProductForm,), {})
    model = getattr(models, product_name)
    model._meta.verbose_name = f'{ct.get_pr_trans(product_name)}'
    model._meta.verbose_name_plural = ct.get_pr_trans(product_name, plural=True)
    setattr(form, 'model', model)

    if model is models.BedSheets:
      ordering = [ct.get_default_filtering(product_name), 'name_ru']
    elif model is models.Basis:
      ordering = ['name']
    else:
      ordering = [ct.get_default_filtering(product_name), 'name']

    attrs = {
      'form': form,
      'exclude': ['markers'],
      'ordering': ordering,
      'actions': [set_best, unset_best, remove_discount]
    }

    admin_model = type(product_name + 'Admin', (admin.ModelAdmin,), attrs)

    layers = {
      models.Mattress: LayerMattressInline,
      models.Pillow: LayerPillowInline,
      models.MattressPad: LayerMattressPadInline
    }
    
    if model in layers.keys():
      setattr(admin_model, 'inlines', (layers[model],))

    admin.site.register(model, admin_model)
