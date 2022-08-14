import i18n from "i18next";
import Backend from 'i18next-http-backend';
import { initReactI18next } from "react-i18next";

i18n.use(Backend).use(initReactI18next).init({
  lng: 'en',
  react: {
    useSuspense: true,
  },
  supported: ['en', 'ru', 'ro'],
  debug: true,
  interpolation: {
    escapeValue: false
  },
  ns: ['shops'],
  defaultNS: 'shops',
  backend: {
    loadPath: '/public/locales/{{lng}}/{{ns}}.json',
  },
});


export default i18n;