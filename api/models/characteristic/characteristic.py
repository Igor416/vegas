from django.db import models
from uuid import uuid4

class Characteristic(models.Model):
	id = models.UUIDField('ID', primary_key=True, default=uuid4)
	
	class Meta:
		abstract = True