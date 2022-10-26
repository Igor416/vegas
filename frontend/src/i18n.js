import i18n from "i18next";
import Backend from 'i18next-http-backend';
import { initReactI18next } from "react-i18next";

let lang = location.search.replace('?lang=', '')

if (lang == '') {
  lang = navigator.language
  
  if (lang.includes('-')) {
    lang = lang.split('-')[0]
  }
}

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


export default i18n;