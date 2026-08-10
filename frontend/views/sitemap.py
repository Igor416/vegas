from urllib.parse import quote

from django.conf import settings
from django.http import HttpResponse

from api.models import MenuFilter, MenuSubCategory, Product

from .constants import DEFAULT_LANG, SUPPORTED_LANGS
from .paths import join_lang_path


def build_sitemap_paths():
    paths = {"/", "/shops", "/sales"}

    sub_categories = MenuSubCategory.objects.select_related("category").all()
    for sub in sub_categories:
        paths.add(f"/catalog/{sub.category.name}/{sub.value}")

    filters = MenuFilter.objects.select_related("menu_sub_category__category").all()
    for flt in filters:
        sub = flt.menu_sub_category
        paths.add(f"/catalog/{sub.category.name}/{sub.value}/{flt.value}")

    products = Product.objects.select_related("category").filter(
        disabled=False, category__disabled=False
    )
    for product in products:
        product_slug = quote(product.name_en, safe="")
        paths.add(f"/product/{product.category.name}/{product_slug}")

    return sorted(paths)


def sitemap_xml(request, *args, **kwargs):
    site_origin = settings.SITE_ORIGIN
    paths = build_sitemap_paths()

    entries = []
    for path_suffix in paths:
        canonical = f"{site_origin}{join_lang_path(DEFAULT_LANG, path_suffix)}"
        alternate_lines = [
            (
                f'    <xhtml:link rel="alternate" hreflang="{lang}" '
                f'href="{site_origin}{join_lang_path(lang, path_suffix)}" />'
            )
            for lang in SUPPORTED_LANGS
        ]
        alternate_lines.append(
            f'    <xhtml:link rel="alternate" hreflang="x-default" '
            f'href="{site_origin}{join_lang_path(DEFAULT_LANG, path_suffix)}" />'
        )
        entries.append(
            "\n".join(
                [
                    "  <url>",
                    f"    <loc>{canonical}</loc>",
                    *alternate_lines,
                    "  </url>",
                ]
            )
        )

    xml = "\n".join(
        [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
            '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
            *entries,
            "</urlset>",
        ]
    )
    return HttpResponse(xml, content_type="application/xml; charset=utf-8")
