def detect_lang(func):
    def method(self, request, *args, **kwargs):
        lang = request.query_params.get('lang').lower()
        return func(self, request, lang, *args, **kwargs)
    return method
        
def detect_country(func):
    def method(self, request, *args, **kwargs):
        country = request.COOKIES.get('country').upper()
        return func(self, request, country, *args, **kwargs)
    return method