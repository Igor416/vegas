from api.models import BooleanCharacteristic
from .characteristic import CharacteristicSerializer

class BooleanCharacteristicSerializer(CharacteristicSerializer):
  class Meta(CharacteristicSerializer.Meta):
    model = BooleanCharacteristic