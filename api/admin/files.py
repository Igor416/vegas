from django.contrib import admin
from api import models
from api import catalog as ct

class ImageListFilter(admin.SimpleListFilter):
  title = 'По категориям'
  parameter_name = 'category'

  def lookups(self, request, model_admin):
    return [(product_name, ct.get_pr_trans(product_name)) for product_name in ct.get_all_categories()]

  def queryset(self, request, queryset):
    if self.value():
      images = []
      for i in queryset.all():
        if len(getattr(models, str(self.value())).objects.filter(name=i.get_name().replace('_', ' '))) != 0:
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