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
        lang = 'dev'

    context = {
        'title': requests.get('http://' + request.get_host() + f'/public/locales/titles/{lang}.json').json()[title]
    }
    
    return render(request, 'frontend/index.html', context=context)
