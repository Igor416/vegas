from django.forms import CharField, Form


class TableForm(Form):
    product = CharField()
    size = CharField()
    value = CharField(required=False, initial="0")
    prev = CharField(required=False, initial="0")
    place = CharField(initial="total")
