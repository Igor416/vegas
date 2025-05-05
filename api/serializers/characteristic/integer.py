from api.models import IntegerCharacteristic
from .characteristic import CharacteristicSerializer

class IntegerCharacteristicSerializer(CharacteristicSerializer):
  class Meta(CharacteristicSerializer.Meta):
    model = IntegerCharacteristic