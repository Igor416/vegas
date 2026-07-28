from django.urls import path, re_path

from .views import index, redirect_default, robots_txt, sitemap_xml

LANG = r"(?P<lang>ro|ru|en)"

urlpatterns = [
    path("robots.txt", robots_txt),
    path("sitemap.xml", sitemap_xml),
    # Localized SPA shell
    re_path(rf"^{LANG}/?$", index),
    re_path(rf"^{LANG}/cart/?$", index),
    re_path(rf"^{LANG}/shops/?$", index),
    re_path(rf"^{LANG}/sales/?$", index),
    re_path(rf"^{LANG}/stock/?$", index),
    re_path(rf"^{LANG}/catalog/(?P<string1>[^/]+)/(?P<string2>[^/]+)/?$", index),
    re_path(
        rf"^{LANG}/catalog/(?P<string1>[^/]+)/(?P<string2>[^/]+)/(?P<string3>[^/]+)/?$",
        index,
    ),
    re_path(rf"^{LANG}/product/(?P<string1>[^/]+)/(?P<string2>[^/]+)/?$", index),
    # Other localized paths (footer company/store pages, etc.)
    re_path(rf"^{LANG}/(?P<subpath>.+)/?$", index),
    path("", redirect_default),
]
