import i18n from "i18next";
import Cookies from "js-cookie";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "@/utils/translation/en.json";
import ar from "@/utils/translation/ar.json";

// Force English as default language, only use cookie if explicitly set to Arabic
const cookieLanguage = Cookies.get("i18next");
const defaultLanguage = cookieLanguage === "ar" ? "ar" : "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    debug: true,
    fallbackLng: "en", // Always fallback to English
    lng: defaultLanguage, // Set initial language
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      //order: ['path', 'cookie', 'htmlTag'],
      caches: ["cookie"],
    },
  });
