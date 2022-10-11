from django.utils.datastructures import MultiValueDictKeyError
from django.shortcuts import render
import requests

# Create your views here.
def index(request, *args, **kwargs):
    title = request.path.split('/')[1]
    if title == '':
        title = 'home'
    try:
        lang = request.GET['lang']
    except MultiValueDictKeyError:
        lang = 'dev'

    context = {
        'title': requests.get('http://' + request.get_host() + f'/public/locales/{lang}/titles.json').json()[title]
    }
    
    return render(request, 'frontend/index.html', context=context)
