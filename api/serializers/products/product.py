from rest_framework.serializers import ModelSerializer
from api.serializers.category import CategorySerializer
from api.serializers.file import FileSerializer

class ProductSerializer(ModelSerializer):
  category = CategorySerializer()
  shortcut = FileSerializer()