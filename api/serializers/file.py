from rest_framework import serializers

class FileSerializer(serializers.Serializer):
  image = serializers.ImageField()
  
  def to_representation(self, obj):
    return obj.get_absolute_url()