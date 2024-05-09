from api.models import Table, Stockable, Action
from openpyxl import load_workbook
from django.utils.timezone import datetime

def load_all():
  wb = load_workbook(r'C:\Users\User\Downloads\оба два (Автосохраненный) (1).xlsx', data_only=True)
  ws = wb.active
  for row in range(3, 206):
    if row in [41, 75, 119, 159, 196]:
      continue
    product = ws.cell(row, 1).value
    size = ws.cell(row, 2).value
    allowed = lambda x: x != None and (type(x) == int or x.isnumeric())
    #maping = {'5': 'SO', '7': 'CI', '8': 'JU', '9': 'RI'}
    qs = Stockable.objects.filter(product=product, size=size)
    m = lambda x: 3 if x > 28 else 4
    '''
    i = 0
    for col in range(14, 44):
      if allowed(ws.cell(row, col).value):
        for _ in range(ws.cell(row, col).value):
          while qs[i].current_place != 'Новый склад' and qs[i].last_action.type != 'T':
            i+=1
          qs[i].actions.add(Action.objects.create(type='S', person='admin', place='SN', date=datetime(2024, m(ws.cell(2, col).value), ws.cell(2, col).value).strftime("%Y-%m-%d"), stockable=qs[i]))
          i+=1
    '''
    '''
    i = 0
    for col in range(5, 10):
      if col == 6 or not allowed(ws.cell(row, col).value):
        continue
      for _ in range(int(ws.cell(row, col).value)):
        print(i, col, end='   ')
        print(qs[i].product, qs[i].size)
        qs[i].actions.add(Action.objects.create(type='T', person='admin', place=maping[str(col)], date=datetime(2024, 4, 1).strftime("%Y-%m-%d"), stockable=qs[i]))
        i += 1
    '''
    '''
    i = 0
    if type(ws.cell(row, 12).value) == str and '+' in ws.cell(row, 12).value:
      for _ in range(int(ws.cell(row, 12).value.split('+')[1])):
        while qs[i].current_place != 'Новый склад':
          i+=1
        qs[i].actions.add(Action.objects.create(type='O', person='admin', place='SN', date=datetime(2024, 4, 1).strftime("%Y-%m-%d"), stockable=qs[i]))
        i += 1
    '''
    '''
    items = sum(map(int, filter(allowed, [ws.cell(row, col).value for col in range(4, 44) if col != 12])))
    for i in range(items):
      s = Stockable.objects.create(product=product, size=size)
      s.actions.add(
        Action.objects.create(type='A', person='admin', place='CA', date=datetime(2024, 4, 1).strftime("%Y-%m-%d"), stockable=s),
        Action.objects.create(type='T', person='admin', place='SN', date=datetime(2024, 4, 1).strftime("%Y-%m-%d"), stockable=s),
      )
    '''

def load_init():
  wb = load_workbook(r'C:\Users\User\Downloads\Telegram Desktop\04.xls', data_only=True)
  ws = wb.active
