import { useT } from "./useT";

/**
 * EN/FR toggle. Shown by default only where `always` is set (the home screen).
 * Everywhere else it appears only in translation-review mode, which you turn on
 * by adding ?review=1 to the URL (or running the dev server). That keeps the
 * fast "flip and check every page" workflow without a toggle on every screen.
 */
const reviewMode = import.meta.env.DEV || new URLSearchParams(window.location.search).has("review");

export default function LanguageToggle({ always = false }: { always?: boolean }) {
  const { i18n } = useT();
  if (!always && !reviewMode) return null;
  const isEn = i18n.language === "en";

  const toggle = () => {
    const newLang = isEn ? "fr" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.lang = newLang;
  };

  return (
    <button
      onClick={toggle}
      aria-label={isEn ? "Passer au français" : "Switch to English"}
      style={{
        background: "#141820",
        border: "1px solid #1e2533",
        borderRadius: 6,
        padding: "4px 10px",
        cursor: "pointer",
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        color: "#94a3b8",
        letterSpacing: 1,
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexShrink: 0
      }}
    >
      <span style={{ color: isEn ? "#e2e8f0" : "#64748b", fontWeight: isEn ? 700 : 400 }}>EN</span>
      <span style={{ color: "#334155" }}>|</span>
      <span style={{ color: !isEn ? "#e2e8f0" : "#64748b", fontWeight: !isEn ? 700 : 400 }}>FR</span>
    </button>
  );
}
