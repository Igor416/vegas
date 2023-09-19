from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CategoryResultSerializer, ProductResultSerializer, SizeSerializer, MattressColectionsPriceSerializer, CategorySerializer, StockSerializer
from .serializers import BestProductSerializerFactory, ListedProductsSerializerFactory, DetailedProductSerializerFactory
from .detectors import detect_lang, detect_country
from .search import search_categories, search_products
from .translations import sales, get_lang
from . import catalog as ct
from . import models

class SearchView(APIView):
    @detect_country
    @detect_lang
    def post(self, request, lang, country):
        search = request.data['search']
        categories_serializer = CategoryResultSerializer(search_categories(search, lang), country=country, lang=lang, many=True)

        products_data = []
        for queryset in search_products(search, lang):
            products_data.append(ProductResultSerializer(queryset, country=country, lang=lang, many=True))

        return Response({'categories': categories_serializer.data, 'products': products_data})

class BestView(APIView):
    @detect_country
    @detect_lang
    def get(self, request, lang, country):
        products, sizes = ct.get_best()
        resp = dict()
        
        for key, vals in products.items():
            resp[key] = []
            for model, name in vals:
                model = getattr(models, model)
                queryset = model.objects.get_by_name(name)
                serializer = BestProductSerializerFactory(model, lang).create(queryset, country=country, lang=lang)
                resp[key].append(serializer.data)

        for i, base, size in zip(range(len(sizes)), resp['BASISES'], sizes):
            width, length = size
            queryset = models.Size.objects.get(product=base['name'], width=width, length=length)
            resp['BASISES'][i]['size'] = SizeSerializer(queryset, country=country).data

        return Response(resp)

class MattressColectionsPriceView(APIView):
    @detect_country
    def get(self, request, country):
        queryset = models.Choice.objects.filter(name='collection')
        serializer = MattressColectionsPriceSerializer(queryset, country=country, many=True)
        return Response(serializer.data)

class CategoryView(APIView):
    @detect_lang
    def get(self, request, lang):
        queryset = models.Category.objects.exclude(desc_en='')
        serializer = CategorySerializer(queryset, lang=lang, many=True)
        return Response(serializer.data)

class ListedProductsView(APIView):
    @detect_country
    @detect_lang
    def get(self, request, lang, country, category, sub_category, filter=None):
        model = getattr(models, category)
        filter = filter.replace('_', ' ') if filter else None
        queryset = model.objects.get_filtered(sub_category, filter)
        serializer = ListedProductsSerializerFactory(model, lang).create(queryset, country=country, lang=lang, many=True)
        return Response(serializer.data)

class DetailedProductView(APIView):
    @detect_country
    @detect_lang
    def get(self, request, lang, country, category, name):
        model = getattr(models, category)
        if model is models.BedSheets:
            queryset = models.objects.filter(name_ru=name) | models.objects.filter(name_en=name) | models.objects.filter(name_ro=name)
            queryset = queryset[0]
        else:
            queryset = model.objects.get(name=name)
        serializer = DetailedProductSerializerFactory(model, lang).create(queryset, country=country, lang=lang)
        return Response(serializer.data)

class SalesView(APIView):
    @detect_country
    @detect_lang
    def get(self, request, lang, country):
        sizes = [s for s in models.Size.objects.all() if s.on_sale]
        resp = []
        for s in sizes:
            model = getattr(models, s.category.name)
            queryset = model.objects.get_by_name(s.product)
            data = ListedProductsSerializerFactory(model, lang).create(queryset, country=country, lang=lang).data
            resp.append(data)

        return Response({'products': resp, 'name_s': sales['name_s'][get_lang(lang)], 'name_pl': sales['name_pl'][get_lang(lang)]})

class StockView(APIView):
    @detect_lang
    def get(self, request, lang):
        queryset = models.Stock.objects.all()
        serializer = StockSerializer(queryset, lang=lang, many=True)
        return Response(sorted(serializer.data, key=lambda stock: stock['discount'], reverse=True))
    
class WorkerView(APIView):
    def get(self, request):
        return Response()
            
            