from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CategorySerializer, create_best_product_serializer, create_list_serializer, create_detail_serializer
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
        products = {}

        products['MATTRESSES'] = [models.Mattress.objects.get_by_name('F3'), models.Mattress.objects.get_by_name('X3')]
        products['PILLOWS'] = [models.Pillow.objects.get_by_name('20'), models.Pillow.objects.get_by_name('Extra Memory')]
        products['ACCESSORIES'] = [models.MattressPad.objects.get_by_name('Stressfree L1'), models.Blanket.objects.get_by_name('SumWin')]
        products['FOR KIDS'] = [models.Mattress.objects.get_by_name('Cocolatex'), models.Pillow.objects.get_by_name('Junior')]
        products['BASISES'] = [models.Basis.objects.get_by_name('SuperLux'), models.Basis.objects.get_by_name('Premium')]
        products['FURNITURE'] = [models.Bed.objects.get_by_name('Milana II'), models.Bed.objects.get_by_name('Victoria')]


        for key, vals in products.items():
            products[key] = [create_best_product_serializer(product.__class__, lang)(product).data for product in vals]

        return Response(products)

class CategoryView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request, category):
        lang = request.GET.get(self.lookup_url_kwarg)
        queryset = models.Category.objects.get(name=category)
        serializer = CategorySerializer(lang, queryset)
        return Response(serializer.data)

class ProductsView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request, product, category, filter=None):
        lang = request.GET.get(self.lookup_url_kwarg)
        model = getattr(models, product)

        filter = filter.replace('_', ' ') if filter else None
        queryset = model.objects.get_filtered(category, filter)
        serializer = create_list_serializer(model, lang)(queryset, many=True)
        return Response(serializer.data)

class ProductDetailsView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request, product, id):
        lang = request.GET.get(self.lookup_url_kwarg)
        model = getattr(models, product)

        queryset = model.objects.get(id=id)
        serializer = create_detail_serializer(model, lang)(queryset)
        return Response(serializer.data)
