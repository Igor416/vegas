from api.models import Category, Product

from .constants import DEFAULT_LANG, DEFAULT_META
from .paths import get_localized_attr


def build_meta(lang: str, path_suffix: str, kwargs: dict):
    meta = dict(DEFAULT_META.get(lang, DEFAULT_META[DEFAULT_LANG]))
    robots = "all"

    clean_path = path_suffix.rstrip("/") or "/"
    if clean_path == "/":
        return meta, robots

    if clean_path == "/shops":
        title_map = {
            "ro": "Magazine Vegas | Vegas Shop",
            "ru": "Магазины Vegas | Vegas Shop",
            "en": "Vegas Stores | Vegas Shop",
        }
        desc_map = {
            "ro": "Adresele magazinelor Vegas din Chisinau, Moldova.",
            "ru": "Адреса магазинов Vegas в Кишиневе, Молдова.",
            "en": "Vegas store locations in Chisinau, Moldova.",
        }
        meta["title"] = title_map.get(lang, title_map[DEFAULT_LANG])
        meta["description"] = desc_map.get(lang, desc_map[DEFAULT_LANG])
        return meta, robots

    if clean_path == "/sales":
        title_map = {
            "ro": "Reduceri | Vegas Shop",
            "ru": "Скидки | Vegas Shop",
            "en": "Sales | Vegas Shop",
        }
        desc_map = {
            "ro": "Oferte si reduceri curente pentru produsele Vegas.",
            "ru": "Актуальные скидки и предложения на продукцию Vegas.",
            "en": "Current discounts and sales for Vegas products.",
        }
        meta["title"] = title_map.get(lang, title_map[DEFAULT_LANG])
        meta["description"] = desc_map.get(lang, desc_map[DEFAULT_LANG])
        return meta, robots

    if clean_path == "/cart":
        title_map = {
            "ro": "Cos | Vegas Shop",
            "ru": "Корзина | Vegas Shop",
            "en": "Cart | Vegas Shop",
        }
        meta["title"] = title_map.get(lang, title_map[DEFAULT_LANG])
        robots = "noindex, nofollow"
        return meta, robots

    if clean_path.startswith("/catalog/"):
        category_slug = kwargs.get("string1")
        try:
            category = Category.objects.get(name=category_slug, disabled=False)
            category_name = get_localized_attr(category, lang, "name_pl")
            category_desc = get_localized_attr(category, lang, "desc")
            title_prefix = {
                "ro": "Catalog",
                "ru": "Каталог",
                "en": "Catalog",
            }.get(lang, "Catalog")
            meta["title"] = f"{title_prefix}: {category_name} | Vegas Shop"
            if category_desc:
                meta["description"] = category_desc
        except Category.DoesNotExist:
            pass
        return meta, robots

    if clean_path.startswith("/product/"):
        category_slug = kwargs.get("string1")
        product_slug = (kwargs.get("string2") or "").replace("%20", " ")
        try:
            product = Product.objects.select_related("category").get(
                category__name=category_slug,
                name_en=product_slug,
                category__disabled=False,
                disabled=False,
            )
            product_name = get_localized_attr(product, lang, "name")
            product_desc = get_localized_attr(product, lang, "desc")
            meta["title"] = f"{product_name} | Vegas Shop"
            if product_desc:
                meta["description"] = product_desc
        except Product.DoesNotExist:
            pass
        return meta, robots

    return meta, robots
