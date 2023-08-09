from django.apps import AppConfig

class ApiConfig(AppConfig):
    name = 'api'
    verbose_name = 'Рабочая среда'
    def ready(self):
        from . import models
        from . import catalog as ct

        for product_name in ct.get_all_categories():
            model = getattr(models, product_name)
            model.set_manager()
        
