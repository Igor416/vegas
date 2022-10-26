from rest_framework.views import APIView
from rest_framework.response import Response
from . import serializers
from .translations import sales, get_lang
from .catalog import Manager
from . import models

manager = Manager()

class SearchView(APIView):
    lookup_url_kwarg = 'lang'

    def post(self, request):
        lang = request.GET.get(self.lookup_url_kwarg).lower()
        search = request.data['search']

        if lang == 'en':
            queryset_categories = models.Category.objects.filter(name_en_s__icontains=search)

        elif lang == 'ru':
            #sqllite3 doesn't support utf-8 search with insensitive case
            objects_categories = models.Category.objects
            queryset_categories = objects_categories.filter(name_ru_s__contains=search.lower())
            queryset_categories = queryset_categories | objects_categories.filter(name_ru_s__contains=search.title())

        elif lang == 'ro':
            queryset_categories = models.Category.objects.filter(name_ro_s__icontains=search)

        categories = []
        choices = []
        products = []
        
        for entry in queryset_categories:
            categories.append({
                'link': f'/catalog/{entry.name}/all',
                'text': getattr(entry, f'name_{lang}_pl'),
                'count': len(getattr(models, entry.name).objects.get_all())
            })

        for product_name in manager.get_all_products():
            model = getattr(models, product_name)
            if model is models.BedSheets:
                if lang == 'en':
                    queryset_products = model.objects.filter(name_en__icontains=search)

                elif lang == 'ru':
                    #sqllite3 doesn't support utf-8 search with insensitive case
                    objects = models.BedSheets.objects
                    queryset_products = objects.filter(name_ru__contains=search.lower())
                    queryset_products = queryset_products | objects.filter(name_ru__contains=search.title())

                elif lang == 'ro':
                    queryset_products = model.objects.filter(name_ro__icontains=search)
            else:
                queryset_products = model.objects.filter(name__icontains=search)

            for entry in queryset_products:
                products.append({
                    'link': f'/product/{entry.category.name}/{entry.id}',
                    'text': f'{getattr(entry.category, f"name_{lang}_s")}: {entry.name}',
                    'price': {
                        'MDL': entry.sizes.all()[0].priceMDL,
                        'EUR': entry.sizes.all()[0].priceEUR
                    },
                    'discount': entry.discount
                })

        return Response({'categories': categories, 'choices': choices, 'products': products})

class BestView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request):
        lang = request.GET.get(self.lookup_url_kwarg)
        products = {
            'MATTRESSES': [('Mattress', 'Favorit'), ('Mattress', 'F3'), ('Mattress', 'X3'), ('Mattress', 'S-3'), ('Mattress', 'Compact2')],
            'PILLOWS': [('Pillow', '20'), ('Pillow', 'Extra Memory'), ('Pillow', '14')],
            'ACCESSORIES': [('MattressPad', 'Stressfree L1'), ('Blanket', 'SumWin'), ('MattressPad', 'Bamboo A1')],
            'FOR KIDS': [('Mattress', 'Cocolatex'), ('Pillow', 'Junior'), ('Pillow', 'Baby Boom')],
            'BASISES': [('Basis', 'SuperLux'), ('Basis', 'SuperLux'), ('Basis', 'Premium')],
            'FURNITURE': [('Bed', 'Milana II'), ('Bed', 'Victoria'), ('Bed', 'Milana IV')]
        }
        sizes = [(160, 200), (90, 200), (160, 200)]

        get_serializer = lambda model: serializers.create_best_product_serializer(getattr(models, model), lang)
        get_product = lambda model, name: getattr(models, model).objects.get_by_name(name)
        
        for key, vals in products.items():
            products[key] = [get_serializer(model)(get_product(model, name)).data for model, name in vals]

        for base, size in zip(products['BASISES'], sizes):
            width, length = size
            size = models.Size.objects.get(product=base['name'], width=width, length=length)
            base['size'] = serializers.SizeSerializer(size).data

        return Response(products)

class MattressColectionsPriceView(APIView):
    def get(self, request):
        serializer = serializers.MattressColectionsPriceSerializer(models.Choice.objects.filter(name='collection'), many=True)
        return Response(serializer.data)

class CategoryView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request, category):
        lang = request.GET.get(self.lookup_url_kwarg)
        queryset = models.Category.objects.get(name=category)
        serializer = serializers.CategorySerializer(lang, queryset)
        return Response(serializer.data)

class ProductsView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request, product, category, filter=None):
        lang = request.GET.get(self.lookup_url_kwarg)
        model = getattr(models, product)

        filter = filter.replace('_', ' ') if filter else None
        queryset = model.objects.get_filtered(category, filter)
        serializer = serializers.create_list_serializer(model, lang)(queryset, many=True)
        return Response(serializer.data)

class ProductDetailsView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request, product, id):
        lang = request.GET.get(self.lookup_url_kwarg)
        model = getattr(models, product)

        queryset = model.objects.get(id=id)
        serializer = serializers.create_detail_serializer(model, lang)(queryset)
        return Response(serializer.data)

class SalesView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request):
        lang = request.GET.get(self.lookup_url_kwarg)
        sizes = [s for s in models.Size.objects.all() if s.on_sale]
        resp = []
        for s in sizes:
            model = getattr(models, s.category.name)
            p = model.objects.get_by_name(s.product)
            data = serializers.create_list_serializer(model, lang)(p).data
            data['size'] = serializers.SizeSerializer(s).data
            data['category'] = model.get_name()
            resp.append(data)
        
        resp = {
            'products': resp,
            'name_s': sales['name_s'][get_lang(lang)],
            'name_pl': sales['name_pl'][get_lang(lang)],
        }
        return Response(resp)

class StockView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request):
        lang = request.GET.get(self.lookup_url_kwarg)
        queryset = models.Stock.objects.all()
        serializer = serializers.StockSerializer(instance=queryset, lang=lang, many=True)
        return Response(sorted(serializer.data, key=lambda stock: stock['discount'], reverse=True))