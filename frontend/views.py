from django.shortcuts import render, redirect

# Create your views here.
def index(request, *args, **kwargs):
  return render(request, 'index.html')

def redirect_view(request, *args, **kwargs):
  return redirect('/')