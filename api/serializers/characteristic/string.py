from api.models import StringCharacteristic
from .characteristic import CharacteristicSerializer

class StringCharacteristicSerializer(CharacteristicSerializer):
  class Meta(CharacteristicSerializer.Meta):
    model = StringCharacteristic