from rest_framework import serializers
from . import models


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'

class MattrassSerializer(ProductSerializer):
    class Meta(ProductSerializer.Meta):
        model = models.Mattrass


class PillowSerializer(ProductSerializer):
    class Meta(ProductSerializer.Meta):
        model = models.Pillow


class MattressPadsSerializer(ProductSerializer):
    class Meta(ProductSerializer.Meta):
        model = models.MattressPads


class BlanketSerializer(ProductSerializer):
    class Meta(ProductSerializer.Meta):
        model = models.Blanket

class BedSheetsSerializer(ProductSerializer):
    class Meta(ProductSerializer.Meta):
        model = models.BedSheets


class BedSerializer(ProductSerializer):
    class Meta(ProductSerializer.Meta):
        model = models.Bed


class StandSerializer(ProductSerializer):
    class Meta(ProductSerializer.Meta):
        model = models.Stand
        

class BasisSerializer(ProductSerializer):
    class Meta(ProductSerializer.Meta):
        model = models.Basis