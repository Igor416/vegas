import json

from api.models import Category, Product
from django.conf import settings

from .paths import get_localized_attr


def _store_schema(site_origin):
    return {
        "@context": "https://schema.org",
        "@type": "Store",
        "name": "Vegas Shop",
        "url": site_origin,
        "telephone": "+37379407032",
        "email": "vegasmd.info@gmail.com",
        "image": f"{site_origin}/static/images/favicon.ico",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Chișinău",
            "addressCountry": "MD",
        },
        "description": "Saltele, perne, plapume și accesorii pentru somn. Magazin online în Chișinău, Moldova.",
        "priceRange": "$$",
    }


def _breadcrumb_schema(site_origin, lang, crumbs):
    """crumbs: list of (name, path) tuples"""
    items = []
    for i, (name, path) in enumerate(crumbs, 1):
        items.append(
            {
                "@type": "ListItem",
                "position": i,
                "name": name,
                "item": f"{site_origin}/{lang}{path}",
            }
        )
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items,
    }


def _product_schema(product, lang, site_origin):
    product_name = get_localized_attr(product, lang, "name")
    product_desc = get_localized_attr(product, lang, "desc")
    category_name = get_localized_attr(product.category, lang, "name_s")

    cheapest = product.sizes.first()
    schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product_name,
        "category": category_name,
        "brand": {"@type": "Brand", "name": "Vegas"},
        "url": f"{site_origin}/{lang}/product/{product.category.name}/{product.name_en}",
    }
    if product_desc:
        schema["description"] = product_desc

    shortcut = product.shortcut
    if shortcut:
        schema["image"] = f"{site_origin}{shortcut.image.url}"

    if cheapest:
        price = cheapest.priceEUR
        discount = cheapest.discount
        final_price = round(price * (100 - discount) / 100, 2)
        offer = {
            "@type": "Offer",
            "price": final_price,
            "priceCurrency": "EUR",
            "availability": "https://schema.org/OutOfStock"
            if cheapest.out_of_stock
            else "https://schema.org/InStock",
            "url": schema["url"],
        }
        if discount > 0:
            offer["priceValidUntil"] = "2026-12-31"
        schema["offers"] = offer

    return schema


def build_schema_json(lang, path_suffix, kwargs):
    site_origin = settings.SITE_ORIGIN
    clean_path = path_suffix.rstrip("/") or "/"
    schemas = []

    if clean_path == "/":
        schemas.append(_store_schema(site_origin))
        return json.dumps(
            schemas if len(schemas) > 1 else schemas[0], ensure_ascii=False
        )

    home_name = {"ro": "Acasă", "ru": "Главная", "en": "Home"}.get(lang, "Home")
    crumbs = [(home_name, "/")]

    if clean_path == "/shops":
        shop_name = {"ro": "Magazine", "ru": "Магазины", "en": "Stores"}.get(
            lang, "Stores"
        )
        crumbs.append((shop_name, "/shops"))
        schemas.append(_breadcrumb_schema(site_origin, lang, crumbs))

    elif clean_path == "/sales":
        sale_name = {"ro": "Reduceri", "ru": "Скидки", "en": "Sales"}.get(lang, "Sales")
        crumbs.append((sale_name, "/sales"))
        schemas.append(_breadcrumb_schema(site_origin, lang, crumbs))

    elif clean_path.startswith("/catalog/"):
        category_slug = kwargs.get("string1")
        cat_label = {"ro": "Catalog", "ru": "Каталог", "en": "Catalog"}.get(
            lang, "Catalog"
        )
        crumbs.append((cat_label, f"/catalog/{category_slug}/all"))
        try:
            category = Category.objects.get(name=category_slug, disabled=False)
            cat_name = get_localized_attr(category, lang, "name_pl")
            crumbs[-1] = (cat_name, f"/catalog/{category_slug}/all")
        except Category.DoesNotExist:
            pass
        schemas.append(_breadcrumb_schema(site_origin, lang, crumbs))

    elif clean_path.startswith("/product/"):
        category_slug = kwargs.get("string1")
        product_slug = (kwargs.get("string2") or "").replace("%20", " ")
        try:
            product = Product.objects.select_related("category").get(
                category__name=category_slug,
                name_en=product_slug,
                category__disabled=False,
                disabled=False,
            )
            cat_name = get_localized_attr(product.category, lang, "name_pl")
            product_name = get_localized_attr(product, lang, "name")
            crumbs.append((cat_name, f"/catalog/{category_slug}/all"))
            crumbs.append((product_name, f"/product/{category_slug}/{product_slug}"))
            schemas.append(_breadcrumb_schema(site_origin, lang, crumbs))
            schemas.append(_product_schema(product, lang, site_origin))
        except Product.DoesNotExist:
            pass

    if not schemas:
        return ""

    if len(schemas) == 1:
        return json.dumps(schemas[0], ensure_ascii=False)
    return json.dumps(schemas, ensure_ascii=False)
