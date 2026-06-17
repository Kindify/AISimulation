import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTranslatedCrisis } from "./useTranslatedCrisis";
import { ROLES, BUILT_IN_CRISES, computeOutcome } from "./EpistemicCommons";
import WORKSHOP_SCENARIOS from "./workshop-scenarios";
import LanguageToggle from "./LanguageToggle";
import { track } from "./analytics";

const METRICS_INFO = [
  { key: "integrity", labelKey: "metrics.integrity", icon: "🎯" },
  { key: "trust", labelKey: "metrics.trust", icon: "👥" },
  { key: "legitimacy", labelKey: "metrics.legitimacy", icon: "⚖️" },
  { key: "rights", labelKey: "metrics.rights", icon: "🛡️" },
];

const gradeColor = (g: string) =>
  ({ A: "#10b981", "A-": "#10b981", B: "#06b6d4", "B-": "#06b6d4", C: "#f59e0b", "C-": "#f59e0b", D: "#f97316", "D-": "#f97316", F: "#ef4444" }[g] ?? "#64748b");

function MetricBar({ label, value, icon }: { label: string; value: number; icon: string }) {
  const pct = (Math.abs(value) / 30) * 100;
  const isPos = value > 0;
  const color = isPos ? "#10b981" : value < 0 ? "#ef4444" : "#64748b";
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase" as const }}>{icon} {label}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color }}>{value > 0 ? "+" : ""}{value}</span>
      </div>
      <div style={{ height: 6, background: "#1e293b", borderRadius: 3, overflow: "hidden", position: "relative" as const }}>
        <div style={{ position: "absolute" as const, left: "50%", top: 0, bottom: 0, width: 1, background: "#334155" }} />
        <div style={{ position: "absolute" as const, top: 0, bottom: 0, left: isPos ? "50%" : `${50 - pct / 2}%`, width: `${pct / 2}%`, background: color, borderRadius: 3, transition: "all 0.8s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

interface Props {
  onBack: () => void;
  onFullPlay: () => void;
}

export default function QuickPlay({ onBack, onFullPlay }: Props) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<"play" | "outcome">("play");
  const [crisis, setCrisis] = useState<any>(null);
  const [role, setRole] = useState<any>(null);
  const [otherDecisions, setOtherDecisions] = useState<any>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [feedbackThinking, setFeedbackThinking] = useState<string | null>(null);
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const randomize = (isReroll = false) => {
    const allCrises = [...BUILT_IN_CRISES, ...(WORKSHOP_SCENARIOS as any[])];
    const randomCrisis = allCrises[Math.floor(Math.random() * allCrises.length)];
    const randomRole = ROLES[Math.floor(Math.random() * ROLES.length)];
    const others: any = {};
    ROLES.forEach(r => {
      if (r.id !== randomRole.id) {
        const opts = randomCrisis.options[r.id];
        others[r.id] = opts[Math.floor(Math.random() * opts.length)].id;
      }
    });
    setCrisis(randomCrisis);
    setRole(randomRole);
    setOtherDecisions(others);
    setSelectedOption(null);
    setOutcome(null);
    setPhase("play");
    setCopied(false);
    setFeedbackThinking(null);
    setFeedbackEmail("");
    setFeedbackSubmitted(false);
    if (isReroll) {
      track("quick_play_reroll");
    } else {
      track("quick_play_loaded", {
        scenario_id: randomCrisis.id,
        scenario_title: randomCrisis.title,
        role_id: randomRole.id,
        role_name: randomRole.name,
      });
    }
  };

  useEffect(() => { randomize(); }, []);

  useEffect(() => {
    if (phase === "outcome" && outcome && crisis && role) {
      track("quick_play_outcome", {
        scenario_id: crisis.id,
        role_id: role.id,
        grade: outcome.coordinationGrade,
        synergies: outcome.triggeredInteractions.filter((i: any) => i.type === "synergy").length,
        conflicts: outcome.triggeredInteractions.filter((i: any) => i.type === "conflict").length,
      });
    }
  }, [phase]);

  const commitChoice = () => {
    if (!selectedOption || !crisis || !role) return;
    const opts: any[] = crisis.options[role.id] || [];
    track("quick_play_commit", {
      scenario_id: crisis.id,
      role_id: role.id,
      option_id: selectedOption,
      option_label: opts.find((o: any) => o.id === selectedOption)?.label || "",
    });
    const allDecisions = { ...otherDecisions, [role.id]: selectedOption };
    const result = computeOutcome(crisis, allDecisions);
    setOutcome(result);
    setPhase("outcome");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const submitFeedback = async () => {
    track("feedback_submitted", {
      tool: "quick_play",
      changed_thinking: feedbackThinking || "",
      has_email: feedbackEmail ? "yes" : "no",
    });
    try {
      const formData = new URLSearchParams();
      formData.append("form-name", "quickplay-feedback");
      formData.append("scenario", crisis?.id || "");
      formData.append("role", role?.id || "");
      formData.append("choice", selectedOption || "");
      formData.append("grade", outcome?.coordinationGrade || "");
      formData.append("changed-thinking", feedbackThinking || "");
      formData.append("email", feedbackEmail);
      formData.append("timestamp", new Date().toISOString());
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
    } catch {}
    setFeedbackSubmitted(true);
  };

  const tc = useTranslatedCrisis(crisis);
  if (!crisis || !role) return null;

  const myOptions: any[] = tc?.options?.[role.id] || crisis.options?.[role.id] || [];
  const selectedOpt = myOptions.find((o: any) => o.id === selectedOption);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&family=Instrument+Serif&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes glow { 0%,100%{ box-shadow: 0 0 0 0 rgba(6,182,212,0); } 50%{ box-shadow: 0 0 0 6px rgba(6,182,212,0.18); } }
    .fade-up { animation: fadeUp 0.5s ease forwards; }
    .qp-option { transition: all 0.18s ease; cursor: pointer; }
    .qp-option:hover { transform: translateY(-1px); }
    .play-now-btn { animation: glow 2.4s ease-in-out infinite; }
  `;

  const S = { fontFamily: "'DM Sans', sans-serif", background: "#0c0f14", color: "#e2e8f0", minHeight: "100vh", padding: "24px 16px" };
  const wrap = { maxWidth: 680, margin: "0 auto" };

  // ─── PLAY PHASE ───────────────────────────────────────
  if (phase === "play") {
    return (
      <div style={S}>
        <style>{css}</style>
        <div style={wrap}>

          {/* Header bar */}
          <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 3, color: "#06b6d4", marginBottom: 4 }}>{t("quickPlay.title")}</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontWeight: 400, color: "#e2e8f0", lineHeight: 1.2 }}>{crisis.icon} {tc.title}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#64748b", marginTop: 4, letterSpacing: 1 }}>{tc.category}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: 8 }}>
              <LanguageToggle />
              <div style={{ background: role.bg, border: `1px solid ${role.color}44`, borderRadius: 10, padding: "12px 14px", display: "inline-block", maxWidth: 200, textAlign: "left" as const }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{role.icon}</span>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, color: role.color, letterSpacing: 1, whiteSpace: "nowrap" as const }}>{t(`roles.${role.id}.name`, role.name)}</div>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#64748b", letterSpacing: 1, marginBottom: 2 }}>{t("quickPlay.yourRole")}</div>
                  <div style={{ fontSize: 10, color: "#e2e8f0", lineHeight: 1.4 }}>{t(`roles.${role.id}.role`, role.role)}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#f59e0b", letterSpacing: 1, marginBottom: 2 }}>{t("quickPlay.yourIncentives")}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.4 }}>{t(`roles.${role.id}.incentive`, role.incentive)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Situation */}
          <div className="fade-up" style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#94a3b8", marginBottom: 10 }}>{t("quickPlay.situation")}</div>
            <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.7 }}>{tc.publicBriefing}</p>
            {crisis.stakes && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1e2533", fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#f59e0b" }}>
                {t("quickPlay.stakes")}: {tc.stakes}
              </div>
            )}
          </div>

          {/* Private Intel */}
          <div className="fade-up" style={{ background: "#141820", border: `1px solid ${role.color}33`, borderRadius: 12, padding: 20, marginBottom: 20, borderLeft: `3px solid ${role.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 14 }}>🔒</span>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: role.color }}>{t("quickPlay.privateIntel")}</div>
            </div>
            {crisis.roleIntel?.[role.id] && (
              <>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#475569", letterSpacing: 1, marginBottom: 10 }}>{tc.roleIntel[role.id].classification}</div>
                {tc.roleIntel[role.id].bullets.map((b: string, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                    <span style={{ color: role.color, fontSize: 12, flexShrink: 0, marginTop: 2 }}>▸</span>
                    <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.55 }}>{b}</p>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Options */}
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#64748b", marginBottom: 12 }}>{t("quickPlay.yourCall")}</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 24 }}>
            {myOptions.map((opt: any) => {
              const isSelected = selectedOption === opt.id;
              return (
                <div
                  key={opt.id}
                  className="qp-option"
                  onClick={() => setSelectedOption(opt.id)}
                  style={{
                    background: isSelected ? `${role.color}12` : "#141820",
                    border: `1px solid ${isSelected ? role.color : "#1e2533"}`,
                    borderRadius: 10,
                    padding: 18,
                    outline: isSelected ? `2px solid ${role.color}44` : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, color: isSelected ? role.color : "#e2e8f0", flex: 1 }}>{opt.label}</div>
                    {isSelected && <span style={{ color: role.color, fontSize: 16, marginLeft: 8 }}>✓</span>}
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>{opt.detail}</p>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#94a3b8", lineHeight: 1.4, padding: "6px 10px", background: "#1e293b", borderRadius: 4, borderLeft: "2px solid #334155" }}>
                    <span style={{ color: "#64748b", letterSpacing: 1, fontSize: 9 }}>{t("quickPlay.tension")}: </span>
                    {opt.tension || opt.detail}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Commit */}
          <button
            onClick={commitChoice}
            disabled={!selectedOption}
            className="play-now-btn"
            style={{
              width: "100%",
              padding: "16px",
              background: selectedOption ? `linear-gradient(135deg, ${role.color}, #06b6d4)` : "#1e293b",
              color: selectedOption ? "#0c0f14" : "#334155",
              border: "none",
              borderRadius: 10,
              cursor: selectedOption ? "pointer" : "not-allowed",
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 2,
              marginBottom: 20,
              transition: "all 0.2s ease",
            }}
          >
            {t("quickPlay.commitDecision")}
          </button>

          {/* Bottom nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => randomize(true)} style={{ background: "none", border: "1px solid #1e2533", borderRadius: 6, padding: "8px 14px", color: "#64748b", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
              {t("quickPlay.differentScenario")}
            </button>
            <button onClick={onBack} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
              ← {t("nav.backToHome")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── OUTCOME PHASE ────────────────────────────────────
  const gc = gradeColor(outcome.coordinationGrade);

  const resultText = [
    `${t("quickPlay.title")} — ${t("home.suiteTitle")}`,
    ``,
    `${t("quickPlay.crisis")}: ${tc?.title ?? crisis.title}`,
    `${t("quickPlay.yourRole")}: ${role.icon} ${t(`roles.${role.id}.name`, role.name)}`,
    `${t("quickPlay.myDecision")}: ${tc?.options?.[role.id]?.find?.((o: any) => o.id === selectedOption)?.label ?? selectedOpt?.label ?? ""}`,
    `${t("quickPlay.coordinationGrade")}: ${outcome.coordinationGrade}`,
    ``,
    ...(outcome.triggeredInteractions.length > 0
      ? outcome.triggeredInteractions.map((i: any) => `${i.type === "synergy" ? "🤝" : "💥"} ${tc?.interactions?.[i._idx]?.label ?? i.label}`)
      : [t("quickPlay.noInteractions")]),
    ``,
    t("quickPlay.keyInsightText"),
    ``,
    `Try it (3 min): strategy.mobilis.studio`,
  ].join("\n");

  const copyResult = () => {
    track("quick_play_share", { scenario_id: crisis.id, grade: outcome.coordinationGrade });
    navigator.clipboard.writeText(resultText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={S}>
      <style>{css}</style>
      <div style={wrap}>

        {/* Grade header */}
        <div className="fade-up" style={{ background: "#141820", border: `1px solid ${gc}33`, borderRadius: 12, padding: 24, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 3, color: "#64748b", marginBottom: 6 }}>{t("quickPlay.crisisOutcome")}</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#e2e8f0", marginBottom: 4 }}>{crisis.icon} {tc.title}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#64748b" }}>{t("quickPlay.yourRoleLabel")} <span style={{ color: role.color }}>{role.icon} {t(`roles.${role.id}.name`, role.name)}</span></div>
          </div>
          <div style={{ textAlign: "right" as const, display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: 8 }}>
            <LanguageToggle />
            <div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 52, color: gc, lineHeight: 1 }}>{outcome.coordinationGrade}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748b", marginTop: 2 }}>{t("quickPlay.coordinationGrade")}</div>
            </div>
          </div>
        </div>

        {/* What everyone decided */}
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#64748b", marginBottom: 10 }}>{t("quickPlay.whatEveryoneDecided")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {ROLES.map(r => {
            const isMe = r.id === role.id;
            const decisionId = isMe ? selectedOption : otherDecisions[r.id];
            const opt = crisis.options[r.id]?.find((o: any) => o.id === decisionId);
            return (
              <div
                key={r.id}
                style={{
                  background: isMe ? `${r.color}0f` : "#141820",
                  border: `1px solid ${isMe ? r.color : r.color + "22"}`,
                  borderRadius: 10,
                  padding: 14,
                  outline: isMe ? `2px solid ${r.color}33` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{r.icon}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, color: r.color, letterSpacing: 1 }}>{r.name}</span>
                  {isMe && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: r.color, background: `${r.color}22`, padding: "1px 5px", borderRadius: 3, marginLeft: "auto" }}>{t("quickPlay.you")}</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>{opt ? (tc?.options?.[r.id]?.find((o: any) => o.id === decisionId)?.label ?? opt.label) : null}</div>
                {!isMe && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#475569" }}>{t("quickPlay.decidedIndependently")}</div>}
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1, padding: "2px 6px", borderRadius: 3, marginTop: 6, display: "inline-block", background: opt?.stance === "transparent" ? "#10b98122" : opt?.stance === "restrictive" ? "#ef444422" : "#f59e0b22", color: opt?.stance === "transparent" ? "#10b981" : opt?.stance === "restrictive" ? "#ef4444" : "#f59e0b" }}>
                  {opt?.stance?.toUpperCase() ? t(`stances.${opt.stance}`) : null}
                </span>
              </div>
            );
          })}
        </div>

        {/* Interactions */}
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#64748b", marginBottom: 10 }}>{t("quickPlay.whatHappened")}</div>
        {outcome.triggeredInteractions.length > 0 ? (
          <div style={{ marginBottom: 16 }}>
            {outcome.triggeredInteractions.map((inter: any, i: number) => (
              <div key={i} className="fade-up" style={{ background: "#141820", border: `1px solid ${inter.type === "synergy" ? "#10b981" : "#ef4444"}33`, borderRadius: 10, padding: 16, marginBottom: 10, borderLeft: `3px solid ${inter.type === "synergy" ? "#10b981" : "#ef4444"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 14 }}>{inter.type === "synergy" ? "🤝" : "💥"}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: inter.type === "synergy" ? "#10b981" : "#ef4444" }}>{inter.type === "synergy" ? t("govGame.synergy") : t("govGame.conflict")}: {tc?.interactions?.[inter._idx]?.label ?? inter.label}</span>
                </div>
                <p style={{ color: "#94a3b8", lineHeight: 1.6, fontSize: 13 }}>{tc?.interactions?.[inter._idx]?.desc ?? inter.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, fontStyle: "italic" }}>
              {t("quickPlay.noInteractions")}
            </p>
          </div>
        )}

        {/* Collective impact */}
        <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#64748b", marginBottom: 12 }}>{t("quickPlay.collectiveImpact")}</div>
          {METRICS_INFO.map(m => <MetricBar key={m.key} label={t(m.labelKey)} value={outcome.scores[m.key]} icon={m.icon} />)}
        </div>

        {/* Key insight */}
        <div className="fade-up" style={{ background: "#141820", border: "1px solid #06b6d433", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#06b6d4", marginBottom: 10 }}>{t("quickPlay.keyInsight")}</div>
          <p style={{ color: "#94a3b8", lineHeight: 1.75, fontSize: 14 }}>
            {t("quickPlay.keyInsightText").split(t("quickPlay.keyInsightBold")).map((part, i) =>
              i === 0 ? <span key={i}>{part}<em style={{ color: "#e2e8f0", fontStyle: "normal", fontWeight: 700 }}>{t("quickPlay.keyInsightBold")}</em></span> : <span key={i}>{part}</span>
            )}
          </p>
        </div>

        {/* Share */}
        <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#06b6d4", marginBottom: 12 }}>{t("quickPlay.shareResult")}</div>
          <div style={{ background: "#0c0f14", border: `1px solid ${gc}33`, borderRadius: 10, padding: 18, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748b" }}>{t("quickPlay.quickPlayResult")}</div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 16, color: "#e2e8f0", marginTop: 4 }}>{tc.title}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: role.color, marginTop: 2 }}>{role.icon} {t(`roles.${role.id}.name`, role.name)}</div>
              </div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, color: gc, lineHeight: 1 }}>{outcome.coordinationGrade}</div>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>
              {t("quickPlay.myDecision")}: <span style={{ color: "#e2e8f0" }}>{tc?.options?.[role.id]?.find?.((o: any) => o.id === selectedOption)?.label ?? selectedOpt?.label ?? null}</span>
            </div>
            {outcome.triggeredInteractions.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 8 }}>
                {outcome.triggeredInteractions.map((i: any, idx: number) => (
                  <span key={idx} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, padding: "3px 8px", borderRadius: 4, background: i.type === "synergy" ? "#10b98122" : "#ef444422", color: i.type === "synergy" ? "#10b981" : "#ef4444" }}>
                    {i.type === "synergy" ? "🤝" : "💥"} {tc?.interactions?.[i._idx]?.label ?? i.label}
                  </span>
                ))}
              </div>
            )}
            <div style={{ paddingTop: 10, borderTop: "1px solid #1e2533", fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#475569" }}>
              strategy.mobilis.studio — AI Governance Simulation
            </div>
          </div>
          <button
            onClick={copyResult}
            style={{ width: "100%", padding: "12px", background: copied ? "#10b981" : "#1e293b", color: copied ? "#0c0f14" : "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1, transition: "all 0.3s ease" }}
          >
            {copied ? t("quickPlay.copiedToClipboard") : t("quickPlay.copyResult")}
          </button>
        </div>

        {/* Feedback */}
        {!feedbackSubmitted ? (
          <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#f59e0b", marginBottom: 14 }}>{t("feedback.title")}</div>
            <p style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{t("feedback.changedThinking")}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 14 }}>
              {[t("feedback.yesSignificantly"), t("feedback.somewhat"), t("feedback.notReally")].map(opt => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setFeedbackThinking(opt)}
                  style={{ padding: "8px 14px", background: feedbackThinking === opt ? "#f59e0b22" : "#0c0f14", border: `1px solid ${feedbackThinking === opt ? "#f59e0b" : "#1e2533"}`, borderRadius: 6, color: feedbackThinking === opt ? "#f59e0b" : "#94a3b8", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, transition: "all 0.2s ease" }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <p style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{t("quickPlay.wantUpdates")}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                value={feedbackEmail}
                onChange={e => setFeedbackEmail(e.target.value)}
                placeholder={t("feedback.emailPlaceholder")}
                style={{ flex: 1, padding: "10px 14px", background: "#0c0f14", border: "1px solid #1e2533", borderRadius: 8, color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif" }}
              />
              <button
                onClick={submitFeedback}
                disabled={!feedbackThinking && !feedbackEmail}
                style={{ padding: "10px 18px", background: (feedbackThinking || feedbackEmail) ? "linear-gradient(135deg, #f59e0b, #06b6d4)" : "#1e293b", color: (feedbackThinking || feedbackEmail) ? "#0c0f14" : "#334155", border: "none", borderRadius: 8, cursor: (feedbackThinking || feedbackEmail) ? "pointer" : "not-allowed", fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 1, whiteSpace: "nowrap" as const }}
              >
                {t("feedback.submit")}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: "#141820", border: "1px solid #10b98133", borderRadius: 12, padding: 18, marginBottom: 16, textAlign: "center" as const }}>
            <p style={{ color: "#10b981", fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700 }}>{t("feedback.thankYou")}</p>
            <p style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>{t("feedback.inputHelps")}</p>
          </div>
        )}

        {/* Full play CTA */}
        <div style={{ background: "linear-gradient(135deg, #06b6d411, #0ea5e911)", border: "1px solid #06b6d433", borderRadius: 12, padding: 24, marginBottom: 20, textAlign: "center" as const }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#06b6d4", marginBottom: 10 }}>{t("quickPlay.wantGoDeeper")}</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#e2e8f0", marginBottom: 10 }}>{t("quickPlay.deeperTitle")}</div>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, marginBottom: 16, maxWidth: 420, margin: "0 auto 16px" }}>
            {t("quickPlay.deeperDesc")}
          </p>
          <button
            onClick={() => { track("quick_play_upsell_click"); onFullPlay(); }}
            style={{ padding: "14px 32px", background: "linear-gradient(135deg, #06b6d4, #0ea5e9)", color: "#0c0f14", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: 2 }}
          >
            {t("quickPlay.playGovGame")}
          </button>
        </div>

        {/* Bottom nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12 }}>
          <button onClick={() => randomize(true)} style={{ background: "none", border: "1px solid #1e2533", borderRadius: 6, padding: "8px 14px", color: "#64748b", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
            {t("quickPlay.playAgain")}
          </button>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
            ← {t("nav.backToHome")}
          </button>
        </div>
      </div>
    </div>
  );
}
