from rest_framework.serializers import ModelSerializer
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

class RecomendedSerializer(ModelSerializer):
    class Meta:
        fields = ['name']
        model = models.Basis

def create_serializer(model):
    class Meta:
        exclude = ['category']
        depth = 1
        
    setattr(Meta, 'model', model)

    fields = {
        'Meta': Meta
    }

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