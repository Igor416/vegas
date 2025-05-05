from rest_framework.serializers import ModelSerializer, SerializerMethodField
from api import models

class TechnologySerializer(ModelSerializer):
  image = SerializerMethodField()
  
  def get_image(self, obj):
    return obj.get_absolute_url()
  
  class Meta:
    exclude = ['id', 'is_technology']
    model = models.Technology