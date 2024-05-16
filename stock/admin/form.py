from django.forms import Form, CharField

class TableForm(Form):
  product = CharField()
  size = CharField()
  value = CharField(required=False)
  prev = CharField(required=False)
  place = CharField(initial='total')