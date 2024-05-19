from django.contrib.auth.mixins import PermissionRequiredMixin
from django.views.generic.detail import DetailView
from django.contrib import admin
from stock.models import Stockable, Table

class TableCategoriesView(PermissionRequiredMixin, DetailView):
  fields = '__all__'
  permission_required = 'stock.view_table'
  template_name = 'admin/stock/table/categories.html'
  model = Table
  
  def get_context_data(self, *args, **kwargs):
    obj = kwargs.get('object')
    return {
      **super().get_context_data(*args, **kwargs),
      **admin.site.each_context(self.request),
      'table_id': obj.id,
      'categories': Stockable.CATEGORIES,
      'opts': self.model._meta,
    }