from django.contrib import admin
from . import models
from . import forms

@admin.register(models.Choice)
class ChoiceAdmin(admin.ModelAdmin):
    form = forms.ChoiceForm

@admin.register(models.Mattrass)
class MattrassAdmin(admin.ModelAdmin):
    form = forms.MattrassForm

@admin.register(models.Pillow)
class PillowAdmin(admin.ModelAdmin):
    form = forms.PillowForm

@admin.register(models.MattressPads)
class MattressPadsAdmin(admin.ModelAdmin):
    form = forms.MattressPadsForm

@admin.register(models.Blanket)
class BlanketAdmin(admin.ModelAdmin):
    form = forms.BlanketForm

@admin.register(models.BedSheets)
class BedSheetsAdmin(admin.ModelAdmin):
    form = forms.BedSheetsForm

@admin.register(models.Bed)
class BedAdmin(admin.ModelAdmin):
    form = forms.BedForm

@admin.register(models.Stand)
class StandAdmin(admin.ModelAdmin):
    form = forms.StandForm

@admin.register(models.Basis)
class BasisAdmin(admin.ModelAdmin):
    form = forms.BasisForm