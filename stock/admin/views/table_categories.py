from django.contrib.auth.mixins import PermissionRequiredMixin
from django.views.generic.detail import DetailView
from django.contrib import admin
from stock.models import Stockable, Table

class TableCategoriesView(PermissionRequiredMixin, DetailView):
  fields = '__all__'
  permission_required = 'stock.view_table'
  template_name = 'admin/stock/table/categories.html'
  model = Table
  
  def get(self, request, *args, **kwargs):
    self.object = self.get_object()
    context = self.get_context_data(object=self.object, request=request, *args, **kwargs)
    return self.render_to_response(context)
  
  def get_context_data(self, *args, **kwargs):
    obj = kwargs.get('object')
    return {
      **super().get_context_data(*args, **kwargs),
      **admin.site.each_context(self.request),
      'table_id': obj.id,
      'month': obj.month,
      'categories': Stockable.CATEGORIES,
      'is_admin': kwargs.get('request').user.groups.first().name != 'Консультант',
      'opts': self.model._meta,
    }