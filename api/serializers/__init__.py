from rest_framework.serializers import ModelSerializer
from api import models
from api import catalog
from api.translations import get_lang, langs
from api.serializers.extractors import LangExtractor, PriceExtractor

class LangDetectiveSerializer(LangExtractor, ModelSerializer):
  def  __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    
class PriceSerializer(PriceExtractor, ModelSerializer):
  def  __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)

from .search import CategoryResultSerializer, ProductResultSerializer
from .size import SizeSerializer
from .mattres_collection_price import MattressColectionsPriceSerializer
from .stock import StockSerializer
from .products_factory import BestProductSerializerFactory, ListedProductsSerializerFactory, DetailedProductSerializerFactory