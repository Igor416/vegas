import requests

def set_prices(resp, country):
    if country is None:
        country = requests.get('https://ipinfo.io/json/').json()['country']
    currencies = {
        'MD': [('MDL', 20.5)],
        'RO': [('RON', 5)]
    }
    country = country if country == 'RO' else 'MD'
    if 'size' in resp:
        resp['size']['priceEUR'] *= 1.2 if country == 'RO' else 1
        for curr, k in currencies[country]:
            resp['size']['price' + curr] = resp['size']['priceEUR'] * k

    elif 'sizes' in resp:
        for size in resp['sizes']:
            size['priceEUR'] *= 1.2 if country == 'RO' else 1
            for curr, k in currencies[country]:
                size['price' + curr] = size['priceEUR'] * k

    return resp
