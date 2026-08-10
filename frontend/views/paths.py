from .constants import DEFAULT_LANG


def path_without_lang(request_path: str, lang: str) -> str:
    """Return path without leading /{lang}, always starting with '/'."""
    prefix = f"/{lang}"
    if request_path == prefix or request_path == f"{prefix}/":
        return "/"
    if request_path.startswith(f"{prefix}/"):
        return request_path[len(prefix) :] or "/"
    return "/"


def join_lang_path(lang: str, suffix: str) -> str:
    if suffix == "/":
        return f"/{lang}/"
    return f"/{lang}{suffix}"


def get_localized_attr(
    obj, lang: str, base_attr: str, fallback_lang: str = DEFAULT_LANG
):
    return getattr(obj, f"{base_attr}_{lang}", "") or getattr(
        obj, f"{base_attr}_{fallback_lang}", ""
    )
