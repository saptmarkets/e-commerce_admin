import i18n from "i18next";
import Cookies from "js-cookie";
import { initReactI18next } from "react-i18next";
import en from "@/utils/translation/en.json";
import ar from "@/utils/translation/ar.json";

// Force English as default language - clear any existing Arabic cookies
const cookieLanguage = Cookies.get("i18next");

// If cookie is set to Arabic, clear it to force English default
if (cookieLanguage === "ar") {
  Cookies.remove("i18next");
  Cookies.remove("_currLang");
}

// Always default to English unless explicitly set to Arabic in current session
const defaultLanguage = "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    debug: true,
    fallbackLng: "en", // Always fallback to English
    lng: defaultLanguage, // Set initial language to English
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
  });
