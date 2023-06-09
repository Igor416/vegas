from rest_framework.serializers import ModelSerializer
from .price import PriceManager
from .translations import langs

class LangDetectiveSerializer(ModelSerializer):
    def __init__(self, *args, **kwargs):
        self.lang = kwargs.pop('lang', 'en')
        super().__init__(*args, **kwargs)
        
    def extract_lang(self, name, r):
        for lang in langs:
            if lang == self.lang:
                r.update({
                    name: r.pop(name + '_' + lang),
                })
                continue
            r.pop(name + '_' + lang)
        return r

class PriceSerializer(ModelSerializer):
    def __init__(self, *args, **kwargs):
        self.country = kwargs.pop('country', 'MD')
        super().__init__(*args, **kwargs)
        
    def extract_price(self, container):
        return PriceManager(container, self.country).container
    
class FileSerializer(ModelSerializer):
    def to_representation(self, obj):
        return obj.get_absolute_url()

    class Meta:
        fields = ['image']