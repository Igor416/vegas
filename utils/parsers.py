from rest_framework.parsers import JSONParser
from utils.transformers import pythonize

class CamelCaseJSONParser(JSONParser):
  def parse(self, stream, media_type=None, parser_context=None):
    data = super().parse(stream, media_type=media_type, parser_context=parser_context)
    return pythonize(data)