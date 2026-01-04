import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,

    fallbackLng: "en",
    supportedLngs: ["en", "he"],
    nonExplicitSupportedLngs: true,

    interpolation: { escapeValue: false },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    resources: {
      en: {
        translation: {
          // Global / Header
          explore: "Explore",
          fiverrPro: "Fiverr Pro",
          becomeSeller: "Become a Seller",
          signIn: "Sign in",
          join: "Join",
          categories: "Categories",

          // Home
          heroTitle: "Our freelancers will take it from here",
          searchPlaceholder: 'Try "building mobile app"',
          popularServices: "Popular services",

          // Common UI
          language: "Language",
          currency: "Currency",
          online: "Online",
          offline: "Offline",

          // Generic actions
          search: "Search",
          clear: "Clear",
          apply: "Apply",
          save: "Save",
          cancel: "Cancel",
          back: "Back",
        },
      },

      he: {
        translation: {
          // Global / Header
          explore: "גלו",
          fiverrPro: "Fiverr Pro",
          becomeSeller: "הפכו למוכרים",
          signIn: "התחברות",
          join: "הרשמה",
          categories: "קטגוריות",

          // Home
          heroTitle: "הפרילנסרים שלנו יטפלו בזה מכאן",
          searchPlaceholder: 'נסו "בניית אפליקציה לנייד"',
          popularServices: "שירותים פופולריים",

          // Common UI
          language: "שפה",
          currency: "מטבע",
          online: "מחובר/ת",
          offline: "לא מחובר/ת",

          // Generic actions
          search: "חיפוש",
          clear: "נקה",
          apply: "החל",
          save: "שמור",
          cancel: "ביטול",
          back: "חזרה",
        },
      },
    },
  });

export default i18n;
