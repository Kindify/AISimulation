import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

// Language resolution order: ?lang=fr in the URL (shareable French links),
// then the saved preference, then English. Scenario translations are added
// per scenario by src/scenarios/index.ts.
const SUPPORTED = ["en", "fr"];
const urlLang = new URLSearchParams(window.location.search).get("lang");
const lng = (urlLang && SUPPORTED.includes(urlLang) ? urlLang : null) || localStorage.getItem("lang") || "en";
if (urlLang && SUPPORTED.includes(urlLang)) localStorage.setItem("lang", urlLang);
document.documentElement.lang = lng;

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fr: { translation: fr } },
  lng,
  fallbackLng: "en",
  returnNull: false,
  interpolation: { escapeValue: false }
});

export default i18n;
