from rest_framework.serializers import ModelSerializer
from . import models

class FileSerializer(ModelSerializer):
  def to_representation(self, obj):
    return obj.get_absolute_url()

  class Meta:
    fields = ['image']
      
class ImageSerializer(FileSerializer):
  class Meta(FileSerializer.Meta):
    model = models.Image

class VideoSerializer(FileSerializer):
  class Meta(FileSerializer.Meta):
    model = models.Video