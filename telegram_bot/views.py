import requests
from vegas.settings import BOT_TOKEN, BOT_URL, CHANNEL_ID
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

PHONE = '079 40-70-32'

class OrderView(APIView):
    lookup_url_kwarg = 'lang'

    def post(self, request):
        lang = request.GET.get(self.lookup_url_kwarg).lower()

        info = request.data
        data = {
            'chat_id': str(CHANNEL_ID), 
            'text': f'Сделан заказ от {info["name"]} из города/населенного пункта: {info["town"]}, по адресу: {info["address"]}. Номер телефона: {info["phone"]}, способ оплаты: {info["payment"]}, способ доставки: {"курьером" if info["courier"] else "самовывоз"}. \nСписок товаров: \n'
        }
        for product in info['products']:
            data['text'] += f'{info["products"].index(product) + 1}) {product["name"]} ({product["category"]})\n    размер: {product["size"]},\n    начальная цена: {product["priceMDL"]} (MDL) / {product["priceEUR"]} (EUR),\n    количество: {product["quantity"]},\n    предварительная скидка: {product["discount"]} &,\n    конечная цена: {product["sumMDL"]} (MDL) / {product["sumEUR"]} (EUR)\n'
        data['text'] += f'Конечная цена: {info["total"]}'
        requests.post(BOT_URL + 'sendMessage', data=data)

        response = {
            'en': f'The order has been sent. Wait for a call from number: ({PHONE})',
            'ru': f'Заказ отправлен. Ожидайте звонка с номера: ({PHONE})',
            'ro': f'Comanda a fost trimisă. Așteptați un apel de la numărul: ({PHONE})'
        }
        return Response(response[lang], status=status.HTTP_202_ACCEPTED)


class OrderCallView(APIView):
    lookup_url_kwarg = 'lang'

    def post(self, request):
        lang = request.GET.get(self.lookup_url_kwarg).lower()

        info = request.data
        data = {
            'chat_id': str(CHANNEL_ID), 
            'text': f'Заказан звонок от: {info["name"]}, номер телефона: {info["phone"]}. Продукт: {info["product"]} ({info["category"]})'
        }
        requests.post(BOT_URL + 'sendMessage', data=data)

        response = {
            'en': f'Wait for a call from number: ({PHONE})',
            'ru': f'Ожидайте звонка с номера: ({PHONE})',
            'ro': f'Așteptați un apel de la numărul: ({PHONE})'
        }
        return Response(response[lang], status=status.HTTP_202_ACCEPTED)

