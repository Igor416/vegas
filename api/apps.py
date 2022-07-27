from django.apps import AppConfig

class ApiConfig(AppConfig):
    name = 'api'
    verbose_name = "Рабочая среда"
    def ready(self):
        from . import models
        from .catalog import Manager

        manager = Manager()

        for product_name in manager.get_all_products():
            model = getattr(models, product_name)
            model.set_manager()
        
