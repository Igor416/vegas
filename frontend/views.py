from django.shortcuts import render
import requests

# Create your views here.
def index(request, *args, **kwargs):
    title = request.path.split('/')[1]
    if title == '':
        title = 'home'
    
    lang = request.GET['lang']
    context = {
        'title': requests.get('http://' + request.get_host() + f'/public/locales/{lang}/titles.json').json()[title]
    }
    print(context)
    return render(request, 'frontend/index.html', context=context)
