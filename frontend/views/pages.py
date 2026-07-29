from django.conf import settings
from django.shortcuts import redirect, render

from .constants import DEFAULT_LANG, SUPPORTED_LANGS
from .meta import build_meta
from .paths import join_lang_path, path_without_lang


def redirect_default(request, *args, **kwargs):
    legacy_path = kwargs.get("legacy_path", "")
    if legacy_path:
        return redirect(f"/{DEFAULT_LANG}/{legacy_path}", permanent=True)
    return redirect(f"/{DEFAULT_LANG}/", permanent=True)


def index(request, *args, **kwargs):
    lang = kwargs.get("lang", DEFAULT_LANG)
    if lang not in SUPPORTED_LANGS:
        lang = DEFAULT_LANG

    path_suffix = path_without_lang(request.path, lang)
    canonical_path = join_lang_path(lang, path_suffix)
    site_root = settings.SITE_ORIGIN

    hreflangs = {
        code: f"{site_root}{join_lang_path(code, path_suffix)}"
        for code in SUPPORTED_LANGS
    }
    meta, robots = build_meta(lang, path_suffix, kwargs)

    context = {
        "html_lang": lang,
        "canonical_url": f"{site_root}{canonical_path}",
        "hreflangs": hreflangs,
        "x_default_url": hreflangs[DEFAULT_LANG],
        "meta_title": meta["title"],
        "meta_description": meta["description"],
        "meta_robots": robots,
    }
    return render(request, "index.html", context)
