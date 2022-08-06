from base64 import encode
import requests
import json
from vegas.settings import BOT_TOKEN, BOT_URL, CHANNEL_ID
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class OrderCallView(APIView):
    lookup_url_kwarg = 'lang'

    def post(self, request):
        lang = request.GET.get(self.lookup_url_kwarg).lower()

        info = request.data
        data = {
            'chat_id': str(CHANNEL_ID), 
            'text': f'Заказан звонок от: {info["name"]}, номер телефона: {info["phone"]}. Продукт: {info["product"]} ({info["category"]})'
        }
        #requests.post(BOT_URL + 'sendMessage', data=data)
        phone = '079 40-70-32'
        response = {
            'en': f'Wait for a call from number: ({phone})',
            'ru': f'Ожидайте звонка с номера: ({phone})',
            'ro': f'Așteptați un apel de la numărul: ({phone})'
        }
        return Response(response[lang], status=status.HTTP_202_ACCEPTED)

