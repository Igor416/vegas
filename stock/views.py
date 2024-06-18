from django.views import View
from django.http import HttpResponse, HttpResponseRedirect
from django.utils.timezone import datetime
from stock.models import Table, Stockable, Action

class WorkerView(View):
  def get(self, request):
    return HttpResponse('ok')
  
class TransferToNewMonthView(View):
  def get(self, request, month):
    today = datetime.today()
    old = Table.objects.get(year=today.year, month=month)
    new, _ = Table.objects.get_or_create(year=today.year, month=today.month)
    if old.id != new.id:
      stockables = Stockable.objects.filter(table=old)
      for s in stockables:
        if s.current_state == 'S':
          s.delete()
        else:
          s.table = new
          s.save()
    return HttpResponseRedirect(f'/admin/stock/table/{new.id}/categories')