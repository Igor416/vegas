from rest_framework.serializers import ModelSerializer

class CharacteristicSerializer(ModelSerializer):
  class Meta:
    exclude = ['id', 'type', 'product']