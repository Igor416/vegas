from rest_framework.serializers import ModelSerializer
from .models import Banner

class BannerSerializer(ModelSerializer):
    class Meta:
        model = Banner
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(BannerSerializer, self).__init__(*args, **kwargs)
        self.lang = kwargs['context']['request'].GET.get('lang')

    def to_representation(self, obj):
        return '/media/' + getattr(obj, f'banner_{self.lang}').name