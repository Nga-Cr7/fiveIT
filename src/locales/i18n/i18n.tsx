import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import English from '../en/english.json'
import Vietnamese from '../vi/vietnamese.json'
// import HOME_EN from '../en/home.json'
// import HOME_VI from '../vi/home.json'
const resources = {
  en: {
    translation: English
  },
  vi: {
    translation: Vietnamese
    
  },
};


i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
