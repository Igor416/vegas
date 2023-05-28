CURRENCIES = {
    'MD': [('MDL', 21)],
    'RO': [('RON', 5)],
    'US': [('USD', 1.1)]
}

class PriceManager:
    def __init__(self, container, request, path=None):
        self.path = path
        self.container = container if self.path is None else container[path]
        self.country = request.COOKIES['country']
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
