from rest_framework.serializers import Serializer
from . import langs

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
        continue
      r.pop(name + '_' + lang)
    return r

class PriceExtractor(Serializer):
  def __init__(self, *args, **kwargs):
    self.country = kwargs.pop('country', 'MD')
    super().__init__(*args, **kwargs)
      
  def extract_price(self, container):
    return PriceManager(container, self.country).container

CURRENCIES = {
    'MD': [('MDL', 21)],
    'RO': [('RON', 5)],
    'US': [('USD', 1.1)]
}

class PriceManager:
  def __init__(self, container, country):
    self.container = container
    self.country = country if country in CURRENCIES else 'US'
    self.EUR = self.container['priceEUR']

    self.set_EUR()
    self.add_curr()
  
  def set_EUR(self):
    self.EUR *= 1.2 if self.country == 'RO' else 1
    self.EUR = round(self.EUR)
    self.container.update({'price': {'EUR': self.EUR}})
    del self.container['priceEUR']

  def add_curr(self):
    for curr, k in CURRENCIES[self.country]:
      self.container['price'][curr] = round(self.EUR * k, 2)