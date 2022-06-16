from django.contrib import admin
from .models import Choice, Mattrass, Pillow, MattressPads, Blanket, BedSheets, Bed, Stand, Basis
from .forms import MattrassForm, PillowForm, MattressPadsForm, BlanketForm, BedSheetsForm, BedForm, StandForm, BasisForm

admin.site.register(Choice)

@admin.register(Mattrass)
class MattrassAdmin(admin.ModelAdmin):
    form = MattrassForm

@admin.register(Pillow)
class PillowAdmin(admin.ModelAdmin):
    form = PillowForm

@admin.register(MattressPads)
class MattressPadsAdmin(admin.ModelAdmin):
    form = MattressPadsForm

@admin.register(Blanket)
class BlanketAdmin(admin.ModelAdmin):
    form = BlanketForm

@admin.register(BedSheets)
class BedSheetsAdmin(admin.ModelAdmin):
    form = BedSheetsForm

@admin.register(Bed)
class BedAdmin(admin.ModelAdmin):
    form = BedForm

@admin.register(Stand)
class StandAdmin(admin.ModelAdmin):
    form = StandForm

@admin.register(Basis)
class BasisAdmin(admin.ModelAdmin):
    form = BasisForm