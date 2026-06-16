import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PacingProblem from "./PacingProblem";
import EpistemicCommonsV2 from "./EpistemicCommons";
import QuickPlay from "./QuickPlay";
import LanguageToggle from "./LanguageToggle";
import { track } from "./analytics";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&family=Instrument+Serif&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes glow { 0%,100%{ box-shadow: 0 0 0 0 rgba(6,182,212,0); } 50%{ box-shadow: 0 0 0 8px rgba(6,182,212,0.15); } }
.fade-up { animation: fadeUp 0.5s ease forwards; }
.slide-in { animation: slideIn 0.4s ease forwards; }
.option-btn { transition: all 0.2s ease; }
.option-btn:hover { transform: translateY(-1px); }
.tool-card { transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer; }
.tool-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
.play-now-btn { animation: glow 2.4s ease-in-out infinite; transition: all 0.2s ease; }
.play-now-btn:hover { transform: translateY(-1px); filter: brightness(1.08); }
textarea, input { font-family: 'DM Sans', sans-serif; }
@media (max-width: 767px) {
  .roleplay-layout { grid-template-columns: 1fr !important; }
  .role-sidebar { display: grid !important; grid-template-columns: 1fr 1fr; gap: 8px; }
  .home-tools { grid-template-columns: 1fr !important; }
}`;

function Home({ onSelect }: { onSelect: (tool: string) => void }) {
  const { t } = useTranslation();
  const [showTheory, setShowTheory] = useState(false);

  useEffect(() => {
    track("home_view");
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0c0f14", color: "#e2e8f0", minHeight: "100vh", padding: "24px" }}>
      <style>{css}</style>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ borderBottom: "1px solid #1e2533", paddingBottom: 20, marginBottom: 36, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 4, color: "#06b6d4", marginBottom: 8 }}>{t("home.suiteTitle")}</div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, fontWeight: 400, lineHeight: 1.15, marginBottom: 12 }}>
              {t("home.headline").split("\n").map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h1>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#64748b" }}>{t("home.subtitle")}</div>
          </div>
          <div style={{ paddingTop: 4 }}>
            <LanguageToggle />
          </div>
        </div>

        {/* Quick Play hero card */}
        <div className="fade-up" style={{ background: "linear-gradient(135deg, #06b6d408, #0ea5e908)", border: "1px solid #06b6d433", borderRadius: 14, padding: 32, marginBottom: 32, position: "relative" as const }}>
          <div style={{ position: "absolute" as const, top: 16, right: 20, fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#06b6d4", background: "#06b6d418", border: "1px solid #06b6d433", borderRadius: 20, padding: "3px 10px" }}>{t("home.quickPlayTime")}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 22 }}>⚡</span>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, color: "#06b6d4", fontWeight: 700 }}>{t("home.quickPlay")}</div>
          </div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, fontWeight: 400, color: "#e2e8f0", marginBottom: 10, lineHeight: 1.2 }}>
            {t("home.quickPlayHero")}
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, marginBottom: 24, maxWidth: 520 }}>
            {t("home.quickPlayDesc")}
          </p>
          <button
            className="play-now-btn"
            onClick={() => { track("quick_play_start_click"); onSelect("quick"); }}
            style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #06b6d4, #0ea5e9)", color: "#0c0f14", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, letterSpacing: 3 }}
          >
            {t("home.playNow")}
          </button>
        </div>

        {/* Go Deeper section */}
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#64748b", marginBottom: 16 }}>{t("home.goDeeper")}</div>
        <div className="home-tools" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 36 }}>

          {/* Pacing Problem */}
          <div className="tool-card" onClick={() => { track("pacing_start_click"); onSelect("pacing"); }} style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 28, display: "flex", flexDirection: "column" as const, gap: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f9731618", border: "1px solid #f9731633", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🏛️</div>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#f97316", marginBottom: 3 }}>{t("home.singlePlayer")}</div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontWeight: 400, lineHeight: 1.1 }}>{t("home.pacingTitle")}</div>
              </div>
            </div>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
              {t("home.pacingDesc")}
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 20 }}>
              {[t("home.tag4crises"), t("home.tagSpeedRigour"), t("home.tagHealth")].map(tag => (
                <span key={tag} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#f97316", background: "#f9731611", padding: "3px 8px", borderRadius: 4 }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#64748b" }}>{t("home.pacingTime")}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: "#f97316", letterSpacing: 1 }}>{t("home.begin")}</span>
            </div>
          </div>

          {/* AI Governance Game */}
          <div className="tool-card" onClick={() => { track("commons_start_click"); onSelect("commons"); }} style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 28, display: "flex", flexDirection: "column" as const, gap: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "#06b6d418", border: "1px solid #06b6d433", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🌐</div>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#06b6d4", marginBottom: 3 }}>{t("home.multiplayerSolo")}</div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontWeight: 400, lineHeight: 1.1 }}>{t("home.govGameTitle")}</div>
              </div>
            </div>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
              {t("home.govGameDesc")}
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 20 }}>
              {[t("home.tag6crises"), t("home.tag4roles"), t("home.tagCoord")].map(tag => (
                <span key={tag} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#06b6d4", background: "#06b6d411", padding: "3px 8px", borderRadius: 4 }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#64748b" }}>{t("home.govGameTime")}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: "#06b6d4", letterSpacing: 1 }}>{t("home.begin")}</span>
            </div>
          </div>
        </div>

        {/* Theory of Change — collapsible */}
        <div style={{ marginBottom: 36 }}>
          <button
            onClick={() => setShowTheory(v => !v)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#141820", border: "1px solid #1e2533", borderRadius: showTheory ? "12px 12px 0 0" : 12, padding: "14px 20px", cursor: "pointer", color: "#94a3b8", fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2 }}
          >
            <span><span style={{ color: "#f59e0b" }}>{showTheory ? "▾" : "▸"}</span> {t("home.theoryToggle")}</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#475569" }}>{showTheory ? t("home.theoryCollapse") : t("home.theoryExpand")}</span>
          </button>
          {showTheory && (
            <div style={{ background: "#141820", border: "1px solid #1e2533", borderTop: "none", borderRadius: "0 0 12px 12px", padding: 24 }}>
              <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: 14, marginBottom: 14 }}>
                {t("home.theoryP1a")}<strong style={{ color: "#e2e8f0" }}>{t("home.theoryP1b")}</strong>{t("home.theoryP1c")}
              </p>
              <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: 14, marginBottom: 14 }}>
                {t("home.theoryP2a")}<strong style={{ color: "#e2e8f0" }}>{t("home.theoryP2b")}</strong>{t("home.theoryP2c")}
              </p>
              <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: 14 }}>
                {t("home.theoryP3a")}<strong style={{ color: "#e2e8f0" }}>{t("home.theoryP3b")}</strong>{t("home.theoryP3c")}
              </p>
              <div style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                {["Individual trade-off reasoning", "Coordination under asymmetric information", "Institutional incentive structures", "Post-catastrophe accountability"].map(tag => (
                  <span key={tag} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#64748b", background: "#1e293b", padding: "4px 10px", borderRadius: 4 }}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center" as const, fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#334155" }}>
          {t("home.footer")}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tool, setTool] = useState<string | null>(null);

  if (tool === "pacing") return <PacingProblem onBack={() => setTool(null)} />;
  if (tool === "commons") return <EpistemicCommonsV2 onBack={() => setTool(null)} />;
  if (tool === "quick") return <QuickPlay onBack={() => setTool(null)} onFullPlay={() => setTool("commons")} />;
  return <Home onSelect={setTool} />;
}
