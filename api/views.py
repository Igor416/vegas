from rest_framework.views import APIView
from rest_framework.response import Response
from .decorators import detect_lang, detect_country
from . import serializers
from .serializer_factory import BestProductSerializerFactory, ListedProductsSerializerFactory, DetailedProductSerializerFactory
from .price import PriceManager
from .translations import sales, get_lang
from .catalog import Manager
from . import models

manager = Manager()

class SearchView(APIView):
    @detect_country
    @detect_lang
    def post(self, request, lang, country):
        search = request.data['search']
        if lang == 'en':
            queryset_categories = models.Category.objects.filter(name_en_s__icontains=search)

        elif lang == 'ru':
            #sqllite3 doesn't support utf-8 search with insensitive case
            objects_categories = models.Category.objects
            queryset_categories = objects_categories.filter(name_ru_s__contains=search.lower())
            queryset_categories |= objects_categories.filter(name_ru_s__contains=search.title())

        elif lang == 'ro':
            queryset_categories = models.Category.objects.filter(name_ro_s__icontains=search)

        categories = []
        
        for entry in queryset_categories:
            categories.append({
                'link': f'/catalog/{entry.name}/all',
                'text': getattr(entry, f'name_{lang}_pl'),
                'count': len(getattr(models, entry.name).objects.get_all())
            })

        products = []
        for product_name in manager.get_all_products():
            model = getattr(models, product_name)
            if model is models.BedSheets:
                if lang == 'en':
                    queryset_products = model.objects.filter(name_en__icontains=search)

                elif lang == 'ru':
                    #sqllite3 doesn't support utf-8 search with insensitive case
                    objects = models.BedSheets.objects
                    queryset_products = objects.filter(name_ru__contains=search.lower())
                    queryset_products |= objects.filter(name_ru__contains=search.title())

                elif lang == 'ro':
                    queryset_products = model.objects.filter(name_ro__icontains=search)
            else:
                queryset_products = model.objects.filter(name__icontains=search)

            for entry in queryset_products:
                product = {
                    'link': f'/product/{entry.category.name}/{entry.id}',
                    'text': f'{getattr(entry.category, f"name_{lang}_s")}: {entry.name}',
                    'priceEUR': entry.sizes.all()[0].priceEUR,
                    'discount': entry.discount
                }
                products.append(PriceManager(product, country).container)

        return Response({'categories': categories, 'products': products})

class BestView(APIView):
    @detect_country
    @detect_lang
    def get(self, request, lang, country):
        products, sizes = manager.get_best()
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
            resp['BASISES'][i]['size'] = serializers.SizeSerializer(queryset, country=country).data

        return Response(resp)

class MattressColectionsPriceView(APIView):
    @detect_country
    def get(self, request, country):
        queryset = models.Choice.objects.filter(name='collection')
        serializer = serializers.MattressColectionsPriceSerializer(queryset, country=country, many=True)
        return Response(serializer.data)

class ProductsView(APIView):
    @detect_country
    @detect_lang
    def get(self, request, lang, country, category, sub_category, filter=None):
        model = getattr(models, category)
        filter = filter.replace('_', ' ') if filter else None
        queryset = model.objects.get_filtered(sub_category, filter)
        serializer = ListedProductsSerializerFactory(model, lang).create(queryset, country=country, lang=lang, many=True)
        return Response(serializer.data)

class ProductDetailsView(APIView):
    @detect_country
    @detect_lang
    def get(self, request, lang, country, category, id):
        model = getattr(models, category)
        queryset = model.objects.get(id=id)
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

        return Response({
            'products': resp,
            'name_s': sales['name_s'][get_lang(lang)],
            'name_pl': sales['name_pl'][get_lang(lang)],
        })

class StockView(APIView):
    @detect_lang
    def get(self, request, lang):
        queryset = models.Stock.objects.all()
        serializer = serializers.StockSerializer(instance=queryset, lang=lang, many=True)
        return Response(sorted(serializer.data, key=lambda stock: stock['discount'], reverse=True))