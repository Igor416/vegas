from rest_framework.renderers import JSONRenderer
from utils.transformers import camelize

class CamelCaseJSONRenderer(JSONRenderer):
  def render(self, data, accepted_media_type=None, renderer_context=None):
    data = camelize(data)
    return super().render(data, accepted_media_type, renderer_context)