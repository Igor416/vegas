from unicodedata import category
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
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
            queryset_choices = models.Choice.objects.filter(property_en__icontains=search)

        elif lang == 'ru':
            #sqllite3 doesn't support utf-8 search with insensitive case
            objects_categories = models.Category.objects
            queryset_categories = objects_categories.filter(name_ru_s__contains=search.lower())
            queryset_categories = queryset_categories | objects_categories.filter(name_ru_s__contains=search.title())

            objects_choices = models.Choice.objects
            queryset_choices = objects_choices.filter(property_ru__contains=search.lower())
            queryset_choices = queryset_choices | objects_choices.filter(property_ru__contains=search.title())

        elif lang == 'ro':
            queryset_categories = models.Category.objects.filter(name_ro_s__icontains=search)
            queryset_choices = models.Choice.objects.filter(property_ro__icontains=search)

        categories = []
        choices = []
        products = []
        
        for entry in queryset_categories:
            categories.append({
                'link': f'/catalog/{entry.name}/all',
                'text': getattr(entry, f'name_{lang}_pl'),
                'count': len(getattr(models, entry.name).objects.get_all())
            })

        for entry in queryset_choices:
            category = models.Category.objects.get(name=manager.get_category_by_prop(entry.name))
            choices.append({
                'link': f'/catalog/{category.name}/{entry.name}/{entry.property_en}',
                'text': getattr(entry, f'property_{lang}'),
                'count': len(getattr(models, category.name).objects.filter(**{entry.name: entry}))
            })

        for product_name in manager.get_all_products():
            model = getattr(models, product_name)
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
    def get(self, request):
        products = {}

        products['MATTRESSES'] = [models.Mattress.objects.get_by_name('F1'), models.Mattress.objects.get_by_name('M1')]
        '''
        products['MATTRESSES'] = [models.Mattress.objects.get_by_name('F3'), models.Mattress.objects.get_by_name('X3')]
        products['PILLOWS'] = [models.Pillow.objects.get_by_name('20'), models.Pillow.objects.get_by_name('Extra Memory')]
        products['ACCESSORIES'] = [models.MattressPad.objects.get_by_name('L3'), models.Blanket.objects.get_by_name('SumWin')]
        products['FOR KIDS'] = [models.Mattress.objects.get_by_name('Cocolatex'), models.Pillow.objects.get_by_name('Junior')]
        products['FURNITURE'] = [models.Bed.objects.get_by_name('Milano 2'), models.Bed.objects.get_by_name('Victoria')]
        products['BASISES'] = [models.Basis.objects.get_by_name('SuperLux'), models.Basis.objects.get_by_name('Premium')]
        '''

        for key, vals in products.items():
            products[key] = [create_best_product_serializer(product.__class__)(product).data for product in vals]

        return Response(products)

class CategoryView(RetrieveAPIView):
    lookup_field = 'name'
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = models.Category.objects.filter(name=self.kwargs.get('name'))
        return queryset

class ProductsView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request, product, category, filter=None):
        lang = request.GET.get(self.lookup_url_kwarg)
        model = getattr(models, product.title())

        filter = filter.replace('_', ' ') if filter else None
        queryset = model.objects.get_filtered(category, filter)
        serializer = create_list_serializer(model, lang)(queryset, many=True)
        return Response(serializer.data)

class ProductDetailView(APIView):
    lookup_url_kwarg = 'lang'

    def get(self, request, product, id):
        lang = request.GET.get(self.lookup_url_kwarg)
        model = getattr(models, product.title())

        queryset = model.objects.get(id=id)
        serializer = create_detail_serializer(model, lang)(queryset)
        return Response(serializer.data)
