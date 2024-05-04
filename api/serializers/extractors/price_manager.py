CURRENCIES = {
  'MD': [('MDL', 20.5)],
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
      self.container['price'][curr] = round(self.EUR * k)