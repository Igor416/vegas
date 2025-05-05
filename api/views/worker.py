from rest_framework.views import APIView
from rest_framework.response import Response
from api import models
import os
import shutil

class WorkerView(APIView):
  def get(self, request):
    images = []
    for product in models.Product.objects.all():
      images.append(product.shortcut.get_name())
    source_folder = r'C:\Users\User\Coding\Python\Django\vegas\media\products'
    output_folder = r'C:\Users\User\Coding\Python\Django\vegas\media\products1'
    for image_name in images:
      src_path = os.path.join(source_folder, image_name + '.jpg')
      dst_path = os.path.join(output_folder, image_name + '.jpg')
      if os.path.exists(src_path):
        #shutil.copy2(src_path, dst_path)
        pass
      else:
        print(image_name)
    return Response()