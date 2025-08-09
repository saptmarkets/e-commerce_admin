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
    debug: false, // Disable debug to reduce console noise
    fallbackLng: "en",
    lng: defaultLanguage,
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    // Force return strings only
    returnObjects: false,
    returnEmptyString: false,
    returnNull: false,
    parseMissingKeyHandler: (key) => key,
    // Custom missing key handler
    missingKeyHandler: (lng, ns, key) => {
      return key;
    },
  });

// Override the t function to always return strings
const originalT = i18n.t;
i18n.t = function(key, options) {
  try {
    const result = originalT.call(this, key, options);
    
    // If the result is an object, return the key instead
    if (typeof result === 'object' && result !== null) {
      console.warn(`Translation returned object for key "${key}", returning key instead`);
      return key;
    }
    
    // If the result is undefined or null, return the key
    if (result === undefined || result === null) {
      return key;
    }
    
    // Ensure we always return a string
    return String(result);
  } catch (error) {
    console.error('Translation error:', error);
    return key;
  }
};

export default i18n;
