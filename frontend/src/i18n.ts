import i18n from "i18next";
import Backend from 'i18next-http-backend';
import { initReactI18next } from "react-i18next";

export function detectLang(): string {
  let lang;
  let search = location.search;

  if (search.includes('?lang=')) {
    lang = search.replace('?lang=', '').slice(0, 2);
  } else {
    lang = navigator.language
    
    if (lang.includes('-')) {
      lang = lang.split('-')[0]
    }
  }
  
  if (search != `?lang=${lang}`) {
    location.replace(location.pathname + `?lang=${lang}`)
  }
  
  return lang;
}

export default function geti18n() {
  let lang = detectLang()

  i18n.use(Backend).use(initReactI18next).init({
    lng: lang,
    fallbackLng: 'en',
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false
    },
    ns: ['home'],
    defaultNS: 'home',
    backend: {
      loadPath: '/public/locales/{{ns}}/{{lng}}.json',
    },
  });
  return i18n
}