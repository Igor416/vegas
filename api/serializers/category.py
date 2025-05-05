from rest_framework.serializers import ModelSerializer
from api import models

class CategorySerializer(ModelSerializer):
  class Meta:
    fields = ['name']
    model = models.Category
    
  def to_representation(self, instance):
    return instance.name

class DetailedCategorySerializer(ModelSerializer):
  class Meta:
    exclude = ['id', 'order', 'disabled']
    model = models.Category