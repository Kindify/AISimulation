import { useState } from "react";
import PacingProblem from "./PacingProblem";
import EpistemicCommonsV2 from "./EpistemicCommons";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&family=Instrument+Serif&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
.fade-up { animation: fadeUp 0.5s ease forwards; }
.slide-in { animation: slideIn 0.4s ease forwards; }
.option-btn { transition: all 0.2s ease; }
.option-btn:hover { transform: translateY(-1px); }
textarea, input { font-family: 'DM Sans', sans-serif; }
.tool-card { transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer; }
.tool-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
@media (max-width: 767px) {
  .roleplay-layout { grid-template-columns: 1fr !important; }
  .role-sidebar { display: grid !important; grid-template-columns: 1fr 1fr; gap: 8px; }
  .home-tools { grid-template-columns: 1fr !important; }
}`;

function Home({ onSelect }: { onSelect: (tool: string) => void }) {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0c0f14", color: "#e2e8f0", minHeight: "100vh", padding: "24px" }}>
      <style>{css}</style>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ borderBottom: "1px solid #1e2533", paddingBottom: 20, marginBottom: 40 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 4, color: "#06b6d4", marginBottom: 8 }}>AI GOVERNANCE SIMULATION SUITE</div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, fontWeight: 400, lineHeight: 1.15, marginBottom: 12 }}>
            How do we govern technology<br />that moves faster than institutions?
          </h1>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#64748b" }}>Two interactive simulations · One theory of change</div>
        </div>

        {/* Theory of change */}
        <div className="fade-up" style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 28, marginBottom: 36 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#f59e0b", marginBottom: 12 }}>THEORY OF CHANGE</div>
          <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
            Effective AI governance doesn't fail because people lack information — it fails because <strong style={{ color: "#e2e8f0" }}>accurate mental models are rare</strong>. Regulators underestimate how fast capability advances. Technologists underestimate how slowly institutions adapt. The public underestimates how much individual decisions depend on what others decide simultaneously.
          </p>
          <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
            These simulations are designed to build the mental models that <strong style={{ color: "#e2e8f0" }}>precede better democratic pressure</strong>: visceral understanding of pacing trade-offs, coordination failures, and the gap between individual good decisions and collective good outcomes.
          </p>
          <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: 15 }}>
            Better mental models → more precise public demands → more robust institutional responses → <strong style={{ color: "#e2e8f0" }}>governance that can actually keep up</strong>.
          </p>
          <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            {["Individual trade-off reasoning", "Coordination under asymmetric information", "Institutional incentive structures", "Post-catastrophe accountability"].map(tag => (
              <span key={tag} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#64748b", background: "#1e293b", padding: "4px 10px", borderRadius: 4 }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Tool cards */}
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#64748b", marginBottom: 16 }}>CHOOSE A SIMULATION</div>
        <div className="home-tools" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>

          {/* Pacing Problem */}
          <div className="tool-card" onClick={() => onSelect("pacing")} style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 28, display: "flex", flexDirection: "column" as const, gap: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f9731618", border: "1px solid #f9731633", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🏛️</div>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#f97316", marginBottom: 3 }}>SINGLE PLAYER</div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontWeight: 400, lineHeight: 1.1 }}>The Pacing Problem</div>
              </div>
            </div>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
              Individual decision-making under uncertainty. You are the director of a national AI regulatory body. Navigate four escalating crises — each forcing a real trade-off between speed and rigour.
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 20 }}>
              {["4 crisis scenarios", "Speed ↔ Rigour spectrum", "Institutional health metrics"].map(t => (
                <span key={t} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#f97316", background: "#f9731611", padding: "3px 8px", borderRadius: 4 }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#64748b" }}>~15 minutes</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: "#f97316", letterSpacing: 1 }}>BEGIN →</span>
            </div>
          </div>

          {/* Epistemic Commons */}
          <div className="tool-card" onClick={() => onSelect("commons")} style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 28, display: "flex", flexDirection: "column" as const, gap: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "#06b6d418", border: "1px solid #06b6d433", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🌐</div>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#06b6d4", marginBottom: 3 }}>MULTIPLAYER / SOLO</div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontWeight: 400, lineHeight: 1.1 }}>The Epistemic Commons</div>
              </div>
            </div>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
              Collective coordination under asymmetric information. Step into four institutional roles — each holding different intelligence. Discover how your choices interact across the system.
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 20 }}>
              {["6 crisis scenarios", "4 institutional roles", "Coordination grade + counterfactuals"].map(t => (
                <span key={t} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#06b6d4", background: "#06b6d411", padding: "3px 8px", borderRadius: 4 }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#64748b" }}>~30 minutes</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: "#06b6d4", letterSpacing: 1 }}>BEGIN →</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" as const, fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#334155" }}>
          A tool for building accurate mental models of AI governance trade-offs
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tool, setTool] = useState<string | null>(null);

  if (tool === "pacing") return <PacingProblem onBack={() => setTool(null)} />;
  if (tool === "commons") return <EpistemicCommonsV2 onBack={() => setTool(null)} />;
  return <Home onSelect={setTool} />;
}
