from base64 import encode
import requests
import json
from vegas.settings import BOT_TOKEN, BOT_URL, CHANNEL_ID
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class OrderCallView(APIView):
    def post(self, request):
        info = request.data
        data = {
            'chat_id': str(CHANNEL_ID), 
            'text': f'Заказан звонок от: {info["name"]}, номер телефона: {info["phone"]}. Продукт: {info["product"]} ({info["category"]})'
        }
        r = requests.post(BOT_URL + 'sendMessage', data=data)
        return Response(status=status.HTTP_202_ACCEPTED)

