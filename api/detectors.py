def detect_lang(func):
  def method(self, request, *args, **kwargs):
    lang = request.COOKIES.get('lang', 'ro').lower()
    return func(self, request, lang, *args, **kwargs)
  return method

def detect_country(func):
  def method(self, request, *args, **kwargs):
    country = request.COOKIES.get('country', 'md').upper()
    return func(self, request, country, *args, **kwargs)
  return method