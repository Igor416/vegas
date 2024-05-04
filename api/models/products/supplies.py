from django.db import models

def create_related_field(prop, multiple=False, plural=False):
	kwargs = {
		'to': 'Choice',
		'related_name': prop + ('%(class)s' if multiple else '')
	}

	if plural:
		field = models.ManyToManyField
	else:
		field = models.ForeignKey
		kwargs.update({'on_delete': models.SET_NULL, 'null': True})

	return field(**kwargs)