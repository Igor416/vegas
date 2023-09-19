from django.shortcuts import render, redirect
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
        lang = request.COOKIES.get('lang').lower()
    except:
        response = redirect(request.path)
        response.set_cookie('lang', 'en')
        return response

    langs = ['en', 'ro', 'ru']
    try:
        langs.remove(lang)
    except:
        pass

    data = requests.get('http://' + request.get_host() + f'/public/locales/main/{lang}.json').json()

    context = {
        'title': data['titles'][title],
        'lang': lang,
        'langs': langs
    }

    return render(request, 'index.html', context=context)