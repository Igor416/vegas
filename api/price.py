CURRENCIES = {
    'MD': [('MDL', 21)],
    'RO': [('RON', 5)]
}

class PriceManager:
    def __init__(self, container, request, path=None):
        self.path = path
        self.container = container
        if self.path is None:
            self.EUR = container['priceEUR']
        else:
            self.EUR = container[path]['priceEUR']
        
        try:
            self.country = request.COOKIES['country']
        except:
            self.country = 'RO'

        self.set_EUR()
        self.add_curr()
    
    def set_EUR(self):
        self.EUR *= 1.2 if self.country == 'RO' else 1
        self.EUR = round(self.EUR)
        if self.path is None:
            self.container['priceEUR'] = self.EUR
        else:
            self.container[self.path]['priceEUR'] = self.EUR

    def add_curr(self):
        for curr, k in CURRENCIES[self.country]:
            if self.path is None:
                self.container['price' + curr] = round(self.EUR * k, 2)
            else:
                self.container[self.path]['price' + curr] = round(self.EUR * k, 2)
