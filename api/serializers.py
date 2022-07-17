from rest_framework.serializers import ModelSerializer, CharField
from . import models
from .catalog import Manager

manager = Manager()

langs = ['en', 'ru', 'ro']

class CategorySerializer(ModelSerializer):
    class Meta:
        exclude = ['id', 'name']
        model = models.Category

    def __init__(self, *args, **kwargs):
        self.lang, *args = args
        super(CategorySerializer, self).__init__(*args, **kwargs)

    def to_representation(self, obj):
        return {
            'name_s': getattr(obj, f'name_{self.lang}_s'),
            'name_pl': getattr(obj, f'name_{self.lang}_pl'),
            'desc': getattr(obj, f'desc_{self.lang}'),
        }
    
class ChoiceSerializer(ModelSerializer):
    class Meta:
        exclude = ['name', 'category']
        model = models.Choice

    def __init__(self, lang, *args, **kwargs):
        super(ChoiceSerializer, self).__init__(*args, **kwargs)
        self.lang = lang

    def to_representation(self, obj):
        return getattr(obj, 'property_' + self.lang)

class SizeSerializer(ModelSerializer):
    class Meta:
        exclude = ['id', 'category']
        model = models.Size

class ImageSerializer(ModelSerializer):
    image = CharField(source='get_absolute_url', read_only=True)

    class Meta:
        fields = ['image']
        model = models.Image

    def to_representation(self, obj):
        return obj.image.name

class VideoSerializer(ModelSerializer):
    video = CharField(source='get_absolute_url', read_only=True)

    class Meta:
        fields = ['video']
        model = models.Video

    def to_representation(self, obj):
        return obj.video.name

class RecomendedSerializer(ModelSerializer):
    class Meta:
        fields = ['name']
        model = models.Basis

def create_serializer(model, lang, detail_view=False):
    class Meta:
        exclude = ['category'] if detail_view else ['category', 'images', 'videos']
        depth = 1
        
    setattr(Meta, 'model', model)

    fields = {
        'Meta': Meta,
        'shortcut': ImageSerializer()
    }

    if detail_view:
        fields.update({'images': ImageSerializer(many=True)})
        fields.update({'videos': VideoSerializer(many=True)})

    for prop in manager.get_all_props(model.get_name()):
        many = models.has_multiple_rels(model, prop)
        serializer = ChoiceSerializer(lang, many=many)

        if prop == 'rigidity':
            fields.update({prop + '1': serializer})
            fields.update({prop + '2': serializer})
        else:
            fields.update({prop: serializer})

    if hasattr(model, 'sizes'):
        fields.update({'sizes': SizeSerializer(many=True)})

    serializer = type(model.get_name() + 'Serializer', (ModelSerializer, ), fields)

    return serializer
