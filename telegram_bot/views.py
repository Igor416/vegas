from vegas.settings import BOT_TOKEN, CHANNEL_ID
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class OrderCallView(APIView):
    def post(self, request):
        bot = telegram.Bot(token=BOT_TOKEN)
        bot.send_message(chat_id=CHANNEL_ID, text=str(request.data))
        return Response(status=status.HTTP_202_ACCEPTED)

