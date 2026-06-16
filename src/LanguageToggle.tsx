import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const toggle = () => {
    const newLang = isEn ? "fr" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <button
      onClick={toggle}
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
