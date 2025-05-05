from rest_framework.serializers import SerializerMethodField
from api.models import Product
from api.serializers.size import SizeSerializer
from api.serializers.file import FileSerializer
from api.serializers.technology import TechnologySerializer
from .product import ProductSerializer

class DetailedProductSerializer(ProductSerializer):
  sizes = SizeSerializer(many=True)
  images = FileSerializer(many=True)
  videos = FileSerializer(many=True)
  markers = SerializerMethodField()
  
  structure = TechnologySerializer(many=True)
  technologies = TechnologySerializer(many=True)
  
  def get_markers(self, obj):
    return obj.markers.split(',') if obj.markers else []
  
  class Meta:
    exclude = ['id']
    model = Product