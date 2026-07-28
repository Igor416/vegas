from django.conf import settings
from django.http import HttpResponse


def robots_txt(request, *args, **kwargs):
    site_origin = settings.SITE_ORIGIN
    lines = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /cart",
        "Disallow: /ro/cart",
        "Disallow: /ru/cart",
        "Disallow: /en/cart",
        f"Sitemap: {site_origin}/sitemap.xml",
    ]
    return HttpResponse("\n".join(lines) + "\n", content_type="text/plain; charset=utf-8")
