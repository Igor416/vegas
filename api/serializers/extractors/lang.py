from rest_framework.serializers import Serializer
from api.translations import langs

class LangExtractor(Serializer):
  def __init__(self, *args, **kwargs):
    self.lang = kwargs.pop('lang', 'en')
    super().__init__(*args, **kwargs)

  def extract_lang(self, name, r):
    for lang in langs:
      if lang == self.lang:
        r.update({
          name: r.pop(name + '_' + lang),
        })
      else:
        r.pop(name + '_' + lang)
    return r