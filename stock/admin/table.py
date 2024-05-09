from django.contrib import admin
from django.urls import path, reverse
from django.utils.html import format_html
from stock.models import Table
from .view import TableDetailView

@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
  list_display = ('to_str', 'table')
  
  def get_urls(self):
    return [
      path(
        '<pk>/detail',
        self.admin_site.admin_view(TableDetailView.as_view()),
        name='table',
      ),
      *super().get_urls(),
    ]
  
  def to_str(self, obj):
    return str(obj)
  
  def table(self, obj):
    url = reverse('admin:table', args=[obj.pk])
    return format_html(f'<a href="{url}">таблица</a>')