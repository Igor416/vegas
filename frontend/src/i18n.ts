import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import Cookies from 'js-cookie';
import { initReactI18next } from 'react-i18next';

export function detectLang(): string {
  let lang = Cookies.get('lang');

  if (!lang) {
    lang = navigator.language
    
    if (lang.includes('-')) {
      lang = lang.split('-')[0]
    }
    console.log(lang)
    Cookies.set('lang', lang)
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