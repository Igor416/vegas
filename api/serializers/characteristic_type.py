from rest_framework.serializers import ModelSerializer
from api import models

class CharacteristicTypeSerializer(ModelSerializer):
  class Meta:
    exclude = ['id', 'category', 'order', 'data_type']
    model = models.CharacteristicType