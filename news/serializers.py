from rest_framework.serializers import ModelSerializer
from .models import Banner, Review

class BannerSerializer(ModelSerializer):
  class Meta:
    model = Banner
    fields = '__all__'

  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    self.lang = kwargs['context']['request'].GET.get('lang', 'en')

  def to_representation(self, obj):
    return '/media/' + getattr(obj, f'banner_{self.lang}').name

class ReviewSerializer(ModelSerializer):
  class Meta:
    model = Review
    fields = '__all__'