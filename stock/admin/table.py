from django.contrib import admin
from django.urls import path, reverse
from django.utils.html import format_html
from stock.models import Table
from .views import TableCategoriesView, TableDetailView

@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
  list_display = ('table',)
  
  def get_urls(self):
    return [
      path(
        '<pk>/categories',
        self.admin_site.admin_view(TableCategoriesView.as_view()),
        name='categories',
      ),
      path(
        '<pk>/<category>/detail',
        self.admin_site.admin_view(TableDetailView.as_view()),
        name='detail',
      ),
      *super().get_urls(),
    ]
  
  def table(self, obj):
    url = reverse('admin:categories', args=[obj.pk])
    return format_html(f'<a href="{url}">Таблица за {obj.year}/{obj.month}</a>')