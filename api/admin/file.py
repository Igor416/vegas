from django.contrib import admin

from api.models import Image, Video

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
  list_filter = ['product__category', 'product']

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
  list_filter = ['product__category', 'product']

class FileInline(admin.TabularInline):
  extra = 0

class ImageInline(FileInline):
  model = Image
  
class VideoInline(FileInline):
  model = Video