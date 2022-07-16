from rest_framework.serializers import ModelSerializer, CharField
from . import models
from .catalog import Manager

manager = Manager()

class ChoiceSerializer(ModelSerializer):
    class Meta:
        fields = ['property_ru', 'property_ro']
        model = models.Choice

class SizeSerializer(ModelSerializer):
    class Meta:
        exclude = ['id', 'category']
        model = models.Size

class ImageSerializer(ModelSerializer):
    image = CharField(source='get_absolute_url', read_only=True)

    class Meta:
        fields = ['image']
        model = models.Image

class VideoSerializer(ModelSerializer):
    video = CharField(source='get_absolute_url', read_only=True)

    class Meta:
        fields = ['video']
        model = models.Video

class RecomendedSerializer(ModelSerializer):
    class Meta:
        fields = ['name']
        model = models.Basis

def create_serializer(model, detail_view=False):
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
        if prop == 'rigidity':
            fields.update({prop + '1': ChoiceSerializer()})
            fields.update({prop + '2': ChoiceSerializer()})
            continue
        many = models.has_multiple_rels(model, prop)
        fields.update({prop: ChoiceSerializer(many=many)})

    if hasattr(model, 'sizes'):
        fields.update({'sizes': SizeSerializer(many=True)})

    serializer = type(model.get_name() + 'Serializer', (ModelSerializer, ), fields)

    return serializer


            

    return serializer