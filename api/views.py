from unicodedata import category
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from .serializers import CategorySerializer, create_list_serializer, create_detail_serializer
from .translations import EN, RU, RO
from .catalog import Manager
from . import models

manager = Manager()

langs = {
    'en': EN,
    'ru': RU,
    'ro': RO
}

class SearchView(APIView):
    lookup_url_kwarg = 'lang'

    def post(self, request):
        lang = request.GET.get(self.lookup_url_kwarg).lower()
        search = request.data['search']

        if lang == 'en':
            queryset_categories = models.Category.objects.filter(name_en_s__icontains=search)
            queryset_choices = models.Choice.objects.filter(property_en__icontains=search)

        elif lang == 'ru':
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
