from django.utils.datastructures import MultiValueDictKeyError
from django.shortcuts import render
import requests

# Create your views here.
def index(request, *args, **kwargs):
    title = request.path.split('/')[1]
    titles = {
        '': 'home',
        'sales': 'catalog'
    }
    if title in titles:
        title = titles[title]
    
    try:
        lang = request.GET['lang']
    except MultiValueDictKeyError:
        lang = 'en'

    langs = ['en', 'ro', 'ru']
    try:
        langs.remove(lang)
    except:
        pass

    data = requests.get('http://' + request.get_host() + f'/public/locales/main/{lang}.json').json()

    context = {
        'title': data['titles'][title],
        'lang': lang,
        'langs': langs,
        'description': data['description'],
        'keywords': data['keywords'],
    }

    return render(request, 'frontend/index.html', context=context)