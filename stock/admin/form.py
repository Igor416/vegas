from django.forms import Form, CharField

class TableForm(Form):
  product = CharField()
  size = CharField()
  value = CharField(required=False, initial='0')
  prev = CharField(required=False, initial='0')
  place = CharField(initial='total')