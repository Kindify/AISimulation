import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { track } from "./analytics";
import LanguageToggle from "./LanguageToggle";

const EVENTS = [
  {
    id: 1,
    title: "Automated Lobbying Surge",
    description: "AI-generated policy briefs flood your agency. 14,000 unique submissions arrived overnight — each tailored to a different committee member. Your team can't distinguish synthetic from genuine constituent input.",
    icon: "📨",
    category: "INSTITUTIONAL INTEGRITY",
    bandwidthCost: 20,
    speedOutcome: {
      label: "Fast-Track Filter",
      detail: "Deploy AI detection tools immediately. Quick but imperfect — risks flagging legitimate grassroots input and creates an arms race with generators.",
      credibility: -8, capture: 15, obsolescence: -5, publicTrust: -5,
      headline: "Agency deploys AI filters — civil liberties groups cry foul over false positives blocking real constituent voices."
    },
    rigourOutcome: {
      label: "Deliberative Review",
      detail: "Convene expert panel to develop comprehensive authentication framework. Thorough but slow — lobbying influence compounds while you deliberate.",
      credibility: 10, capture: -5, obsolescence: 12, publicTrust: 5,
      headline: "Agency announces 6-month review process. Meanwhile, three major AI bills pass committee shaped primarily by synthetic submissions."
    },
    balancedOutcome: {
      label: "Tiered Triage",
      detail: "Immediate flagging of obvious synthetic content while launching parallel review. Pragmatic but resource-intensive.",
      credibility: 2, capture: 5, obsolescence: 3, publicTrust: 0,
      headline: "Agency implements interim measures — effective but straining already-limited staff capacity across other priorities."
    }
  },
  {
    id: 2,
    title: "Deepfake Election Crisis",
    description: "A synthetic video of a presidential candidate endorsing an extremist position goes viral 72 hours before a major election. 40 million views and climbing. News networks are split on authenticity.",
    icon: "🎭",
    category: "EPISTEMIC SECURITY",
    bandwidthCost: 25,
    speedOutcome: {
      label: "Emergency Takedown Order",
      detail: "Issue immediate content removal directive to platforms. Decisive but sets precedent for government-ordered speech suppression — and the Streisand effect may amplify the video.",
      credibility: -12, capture: 10, obsolescence: -3, publicTrust: -15,
      headline: "Government orders video removal — opposition party alleges censorship. 'Banned' video now shared 3x more on alternative platforms."
    },
    rigourOutcome: {
      label: "Forensic Verification Protocol",
      detail: "Commission independent forensic analysis and publish findings. Scientifically rigorous but the election may be over before the report drops.",
      credibility: 15, capture: -3, obsolescence: 15, publicTrust: 8,
      headline: "Forensic report confirms deepfake — published 4 days after election. 23% of voters say the video influenced their decision."
    },
    balancedOutcome: {
      label: "Rapid Advisory + Investigation",
      detail: "Issue public advisory flagging suspected manipulation while launching fast-track investigation. Transparent but may be seen as prejudging the outcome.",
      credibility: 3, capture: 3, obsolescence: 5, publicTrust: -3,
      headline: "Agency advisory reaches 12M people but critics question whether flagging before confirmation is itself a form of influence."
    }
  },
  {
    id: 3,
    title: "Autonomous Hiring Discrimination",
    description: "Investigative journalists reveal that an AI hiring system used by 200+ employers has been systematically filtering out candidates from certain demographics. 2.3 million job applications affected over 18 months.",
    icon: "⚖️",
    category: "CIVIL RIGHTS",
    bandwidthCost: 20,
    speedOutcome: {
      label: "Immediate Moratorium",
      detail: "Ban all AI hiring tools pending review. Protective but cripples companies' hiring pipelines and may push systems underground where oversight is impossible.",
      credibility: -5, capture: 5, obsolescence: -8, publicTrust: 5,
      headline: "AI hiring ban causes chaos — companies report 60% slowdown in recruitment. Some quietly switch to unregulated offshore AI screening tools."
    },
    rigourOutcome: {
      label: "Comprehensive Audit Framework",
      detail: "Develop mandatory algorithmic impact assessment standards with industry consultation. Gold-standard policy but affected candidates continue to be filtered out during the 14-month process.",
      credibility: 12, capture: -8, obsolescence: 10, publicTrust: -5,
      headline: "Landmark audit framework published after 14 months. Estimated 800,000 additional applications were filtered during the review period."
    },
    balancedOutcome: {
      label: "Targeted Suspension + Fast Audit",
      detail: "Suspend the specific system identified while accelerating audit standards. Focused but resource-intensive and other biased systems remain operational.",
      credibility: 5, capture: 0, obsolescence: 3, publicTrust: 2,
      headline: "One system suspended but investigation reveals 12 similar tools still in use — agency lacks bandwidth to address all simultaneously."
    }
  },
  {
    id: 4,
    title: "Foundation Model Capability Jump",
    description: "A leading AI lab announces a model demonstrating unexpected autonomous planning capabilities. The system can decompose complex goals and execute multi-step strategies without human guidance. International competitors are 6 months behind.",
    icon: "🧠",
    category: "EXISTENTIAL RISK GOVERNANCE",
    bandwidthCost: 30,
    speedOutcome: {
      label: "Emergency Deployment Restrictions",
      detail: "Impose immediate capability restrictions on frontier models. Assertive but risks driving development to less-regulated jurisdictions and may be technically unenforceable.",
      credibility: -10, capture: 8, obsolescence: -10, publicTrust: -8,
      headline: "US restricts frontier AI — lab announces relocation of advanced research division to Singapore. Allied nations question unilateral action."
    },
    rigourOutcome: {
      label: "International Standards Process",
      detail: "Initiate multilateral framework for autonomous capability governance through existing international bodies. Legitimate but geopolitical coordination takes years while capabilities advance in months.",
      credibility: 12, capture: -10, obsolescence: 20, publicTrust: 5,
      headline: "UN working group established with 18-month timeline. Three additional labs achieve autonomous planning capability during negotiations."
    },
    balancedOutcome: {
      label: "Bilateral Agreements + Monitoring",
      detail: "Negotiate rapid bilateral agreements with key nations while establishing capability monitoring. Practical but incomplete coverage and monitoring tools lag behind capabilities.",
      credibility: 4, capture: 0, obsolescence: 8, publicTrust: 0,
      headline: "Agreements signed with 4 nations covering 60% of frontier labs. Monitoring regime reveals detection gaps for novel capability types."
    }
  }
];

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function GaugeBar({ label, value, color, icon, subtitle }: any) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1.5, color: "#94a3b8", textTransform: "uppercase" as const }}>
          {icon} {label}
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color, fontWeight: 700 }}>
          {value}%{subtitle ? ` — ${subtitle}` : ""}
        </span>
      </div>
      <div style={{ height: 8, background: "#1e293b", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 4, transition: "width 0.8s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

function SpectrumSlider({ value, onChange, disabled }: any) {
  return (
    <div style={{ margin: "20px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ textAlign: "left" as const }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color: "#f97316", letterSpacing: 1 }}>⚡ SPEED</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#64748b", marginTop: 2 }}>Act fast, risk capture</div>
        </div>
        <div style={{ textAlign: "right" as const }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color: "#3b82f6", letterSpacing: 1 }}>RIGOUR 🔬</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#64748b", marginTop: 2 }}>Be thorough, risk obsolescence</div>
        </div>
      </div>
      <div style={{ position: "relative" as const, padding: "8px 0" }}>
        <div style={{ position: "absolute" as const, top: "50%", left: 0, right: 0, height: 6, transform: "translateY(-50%)", background: "linear-gradient(90deg, #f97316, #a855f7 50%, #3b82f6)", borderRadius: 3, opacity: disabled ? 0.3 : 0.8 }} />
        <input type="range" min={0} max={100} value={value} onChange={e => onChange(+e.target.value)} disabled={disabled}
          style={{ width: "100%", position: "relative" as const, zIndex: 1, appearance: "none" as any, background: "transparent", cursor: disabled ? "not-allowed" : "pointer", height: 24 }} />
      </div>
      <div style={{ textAlign: "center" as const, fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, marginTop: 4, color: value < 35 ? "#f97316" : value > 65 ? "#3b82f6" : "#a855f7" }}>
        {value < 35 ? "SPEED-BIASED" : value > 65 ? "RIGOUR-BIASED" : "BALANCED"} ({value})
      </div>
    </div>
  );
}

export default function PacingProblem({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState("intro");
  const [currentEvent, setCurrentEvent] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [showOutcome, setShowOutcome] = useState(false);
  const [outcomeData, setOutcomeData] = useState<any>(null);
  const [animateIn, setAnimateIn] = useState(false);

  const [state, setState] = useState({
    bandwidth: 100, credibility: 60, captureRisk: 15, obsolescenceRisk: 15, publicTrust: 65,
    history: [] as any[], turn: 0
  });

  // Debrief engagement state
  const [copied, setCopied] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackThinking, setFeedbackThinking] = useState<string | null>(null);
  const [feedbackUseCase, setFeedbackUseCase] = useState<string | null>(null);
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  useEffect(() => {
    if (phase === "event") {
      setAnimateIn(false);
      const t = setTimeout(() => setAnimateIn(true), 50);
      return () => clearTimeout(t);
    }
  }, [phase, currentEvent]);

  const getStatusLabel = (v: number, metric: string) => {
    if (metric === "captureRisk" || metric === "obsolescenceRisk") {
      if (v >= 70) return "CRITICAL"; if (v >= 45) return "ELEVATED"; if (v >= 25) return "MODERATE"; return "LOW";
    }
    if (v >= 70) return "STRONG"; if (v >= 45) return "STABLE"; if (v >= 25) return "STRAINED"; return "CRITICAL";
  };

  const submitChoice = useCallback(() => {
    const ev = EVENTS[currentEvent];
    const outcomeType = sliderValue < 35 ? "speedOutcome" : sliderValue > 65 ? "rigourOutcome" : "balancedOutcome";
    const outcome: any = ev[outcomeType as keyof typeof ev];

    track("pacing_decision", {
      event_id: ev.id,
      event_title: ev.title,
      slider_value: sliderValue,
      bias: sliderValue < 35 ? "speed" : sliderValue > 65 ? "rigour" : "balanced",
      choice_label: outcome.label,
    });

    setState(prev => ({
      ...prev,
      bandwidth: clamp(prev.bandwidth - ev.bandwidthCost, 0, 100),
      credibility: clamp(prev.credibility + outcome.credibility, 0, 100),
      captureRisk: clamp(prev.captureRisk + outcome.capture, 0, 100),
      obsolescenceRisk: clamp(prev.obsolescenceRisk + outcome.obsolescence, 0, 100),
      publicTrust: clamp(prev.publicTrust + outcome.publicTrust, 0, 100),
      history: [...prev.history, { event: ev.title, choice: outcome.label, slider: sliderValue, bias: sliderValue < 35 ? "speed" : sliderValue > 65 ? "rigour" : "balanced", eventId: ev.id, outcomeType }],
      turn: prev.turn + 1
    }));
    setOutcomeData({ ...outcome, _eventId: ev.id, _type: outcomeType });
    setShowOutcome(true);
  }, [currentEvent, sliderValue]);

  const nextEvent = useCallback(() => {
    setShowOutcome(false); setOutcomeData(null); setSliderValue(50);
    if (currentEvent >= EVENTS.length - 1) setPhase("debrief");
    else setCurrentEvent(c => c + 1);
  }, [currentEvent]);

  const restart = () => {
    setPhase("intro"); setCurrentEvent(0); setSliderValue(50); setShowOutcome(false); setOutcomeData(null);
    setState({ bandwidth: 100, credibility: 60, captureRisk: 15, obsolescenceRisk: 15, publicTrust: 65, history: [], turn: 0 });
    setCopied(false); setFeedbackSubmitted(false); setFeedbackThinking(null); setFeedbackUseCase(null); setFeedbackEmail(""); setFeedbackSubmitting(false);
  };

  const gameOver = state.bandwidth <= 0 || state.captureRisk >= 90 || state.obsolescenceRisk >= 90 || state.publicTrust <= 5;
  useEffect(() => { if (gameOver && phase === "event") setPhase("debrief"); }, [gameOver, phase]);

  useEffect(() => {
    if (phase === "debrief") {
      const speedChoices = state.history.filter(h => h.bias === "speed").length;
      const balancedChoices = state.history.filter(h => h.bias === "balanced").length;
      const rigourChoices = state.history.filter(h => h.bias === "rigour").length;
      let archetype = "The Muddling Through";
      if (state.captureRisk >= 60) archetype = "The Captured Regulator";
      else if (state.obsolescenceRisk >= 60) archetype = "The Museum Piece";
      else if (state.publicTrust <= 25) archetype = "The Discredited Authority";
      else if (state.credibility >= 50 && state.captureRisk < 40 && state.obsolescenceRisk < 40) archetype = "The Adaptive Institution";
      track("pacing_debrief", {
        archetype,
        bandwidth: state.bandwidth,
        credibility: state.credibility,
        capture_risk: state.captureRisk,
        obsolescence_risk: state.obsolescenceRisk,
        public_trust: state.publicTrust,
        speed_choices: speedChoices,
        balanced_choices: balancedChoices,
        rigour_choices: rigourChoices,
      });
    }
  }, [phase]);

  const S = { fontFamily: "'DM Sans', sans-serif", background: "#0c0f14", color: "#e2e8f0", minHeight: "100vh", padding: "24px" };

  const headerBar = (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: "1px solid #1e2533", paddingBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #1e2533", borderRadius: 6, color: "#64748b", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 1, padding: "6px 12px", transition: "all 0.2s" }}
          onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "#334155"; (e.target as HTMLElement).style.color = "#94a3b8"; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "#1e2533"; (e.target as HTMLElement).style.color = "#64748b"; }}>
          ← {t("nav.backToHome")}
        </button>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#f97316", marginBottom: 4 }}>{t("pacing.suiteLabel")}</div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, fontWeight: 400, lineHeight: 1.1, color: "#e2e8f0" }}>{t("pacing.title")}</h1>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#64748b", marginTop: 4 }}>{t("pacing.subtitle")}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {phase !== "intro" && (
          <div style={{ textAlign: "right" as const }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#64748b" }}>{phase === "debrief" ? t("pacing.debrief") : t("pacing.scenario")}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: "#e2e8f0" }}>
              {phase === "debrief" ? t("pacing.debrief") : `${currentEvent + 1} / ${EVENTS.length}`}
            </div>
          </div>
        )}
        <LanguageToggle />
      </div>
    </div>
  );

  if (phase === "intro") {
    return (
      <div style={S}>
        {headerBar}
        <div style={{ maxWidth: 640, margin: "0 auto", paddingTop: 32 }}>
          <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 32, animation: "fadeUp 0.5s ease forwards" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏛️</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, marginBottom: 16 }}>{t("pacing.youAreDirector")}</h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: 15, marginBottom: 20 }}>
              {t("pacing.introText")}
            </p>
            <div style={{ background: "#1e293b", borderRadius: 8, padding: 16, marginBottom: 20 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 1.5, color: "#f97316", marginBottom: 10 }}>{t("pacing.pacingProblem")}</div>
              <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: 14 }}>
                {t("pacing.pacingProblemText")}
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {[
                { icon: "⚡", label: t("pacing.speed"), desc: t("pacing.speedDesc"), color: "#f97316" },
                { icon: "🔬", label: t("pacing.rigour"), desc: t("pacing.rigourDesc"), color: "#3b82f6" },
                { icon: "📊", label: t("pacing.bandwidth"), desc: t("pacing.bandwidthDesc"), color: "#10b981" },
                { icon: "🏛️", label: t("pacing.credibility"), desc: t("pacing.credibilityDesc"), color: "#f59e0b" }
              ].map((item, i) => (
                <div key={i} style={{ background: "#0c0f14", borderRadius: 8, padding: 12, border: "1px solid #1e2533" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: item.color, letterSpacing: 1 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, lineHeight: 1.4 }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <button onClick={() => { track("pacing_start"); setPhase("event"); }} style={{ width: "100%", padding: "14px 24px", background: "linear-gradient(135deg, #f97316, #a855f7)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const }}>
              {t("pacing.beginSimulation")} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "debrief") {
    const speedChoices = state.history.filter(h => h.bias === "speed").length;
    const rigourChoices = state.history.filter(h => h.bias === "rigour").length;
    const balancedChoices = state.history.filter(h => h.bias === "balanced").length;

    let archetype, archetypeDesc, archetypeColor;
    if (state.captureRisk >= 60) { archetype = "The Captured Regulator"; archetypeDesc = "Your institution became an extension of the industries it was meant to oversee. Speed without sufficient safeguards eroded independence. This mirrors real patterns seen in financial regulation pre-2008 and telecom oversight in the 1990s."; archetypeColor = "#ef4444"; }
    else if (state.obsolescenceRisk >= 60) { archetype = "The Museum Piece"; archetypeDesc = "Your institution produced excellent analysis that arrived too late to matter. By the time your frameworks were published, the technology had moved on. This is the trajectory of many international standards bodies confronting rapid technological change."; archetypeColor = "#3b82f6"; }
    else if (state.publicTrust <= 25) { archetype = "The Discredited Authority"; archetypeDesc = "Your institution lost the public mandate needed to govern effectively. Without democratic legitimacy, even good policy can't be implemented. This reflects the challenge facing institutions like the WHO during contested crises."; archetypeColor = "#f59e0b"; }
    else if (state.credibility >= 50 && state.captureRisk < 40 && state.obsolescenceRisk < 40) { archetype = "The Adaptive Institution"; archetypeDesc = "You managed the impossible balance — maintaining enough speed to stay relevant while preserving enough rigour to stay credible. This is rare in practice, but institutions like DARPA and certain central banks have achieved it in narrow domains."; archetypeColor = "#10b981"; }
    else { archetype = "The Muddling Through"; archetypeDesc = "You avoided catastrophic failure but accumulated damage on all fronts. This is the most common real-world outcome — institutions that survive but gradually lose effectiveness. Reform becomes harder the longer this state persists."; archetypeColor = "#a855f7"; }

    const resultText = [
      `🏛️ INSTITUTIONAL STRESS TEST — The Pacing Problem Simulator`,
      ``,
      `My Result: ${archetype}`,
      ``,
      `Final Metrics:`,
      `  📊 Bandwidth: ${state.bandwidth}%`,
      `  🏛️ Credibility: ${state.credibility}%`,
      `  👥 Public Trust: ${state.publicTrust}%`,
      `  🎯 Capture Risk: ${state.captureRisk}%`,
      `  ⏳ Obsolescence: ${state.obsolescenceRisk}%`,
      ``,
      `Decision Pattern: ⚡ Speed: ${speedChoices} | ⚖️ Balanced: ${balancedChoices} | 🔬 Rigour: ${rigourChoices}`,
      ``,
      `There is no correct answer — only trade-offs.`,
      ``,
      `Try it: strategy.mobilis.studio`
    ].join('\n');

    const copyResult = () => {
      track("pacing_share", { archetype });
      navigator.clipboard.writeText(resultText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    };

    const submitFeedback = async () => {
      track("feedback_submitted", {
        tool: "pacing",
        changed_thinking: feedbackThinking || "",
        use_case: feedbackUseCase || "",
        has_email: feedbackEmail ? "yes" : "no",
      });
      setFeedbackSubmitting(true);
      try {
        const formData = new URLSearchParams();
        formData.append("form-name", "simulation-feedback");
        formData.append("tool", "pacing-problem");
        formData.append("archetype", archetype);
        formData.append("grade", archetypeColor);
        formData.append("changed-thinking", feedbackThinking || "");
        formData.append("use-case", feedbackUseCase || "");
        formData.append("email", feedbackEmail);
        formData.append("timestamp", new Date().toISOString());
        await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString()
        });
        setFeedbackSubmitted(true);
      } catch (err) {
        console.error("Feedback submission error:", err);
        setFeedbackSubmitted(true);
      }
      setFeedbackSubmitting(false);
    };

    return (
      <div style={S}>
        {headerBar}
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ background: "#141820", border: `1px solid ${archetypeColor}33`, borderRadius: 12, padding: 32, marginBottom: 20, animation: "fadeUp 0.5s ease forwards" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, color: archetypeColor, marginBottom: 8 }}>{t("pacing.institutionalOutcome")}</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, fontWeight: 400, color: archetypeColor, marginBottom: 12 }}>{archetype}</h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: 14 }}>{archetypeDesc}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 20 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#64748b", marginBottom: 12 }}>{t("pacing.finalMetrics")}</div>
              <GaugeBar label="Bandwidth" value={state.bandwidth} color="#10b981" icon="📊" />
              <GaugeBar label="Credibility" value={state.credibility} color="#f59e0b" icon="🏛️" />
              <GaugeBar label="Public Trust" value={state.publicTrust} color="#3b82f6" icon="👥" />
              <GaugeBar label="Capture Risk" value={state.captureRisk} color="#ef4444" icon="🎯" />
              <GaugeBar label="Obsolescence" value={state.obsolescenceRisk} color="#8b5cf6" icon="⏳" />
            </div>
            <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 20 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#64748b", marginBottom: 12 }}>{t("pacing.decisionPattern")}</div>
              {state.history.map((h, i) => (
                <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < state.history.length - 1 ? "1px solid #1e2533" : "none" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#64748b" }}>{t("pacing.event")} {i + 1}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginTop: 2 }}>{t(`scenarios.pacing_event_${h.eventId ?? 0}.title`, h.event)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 1, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: h.bias === "speed" ? "#f9731622" : h.bias === "rigour" ? "#3b82f622" : "#a855f722", color: h.bias === "speed" ? "#f97316" : h.bias === "rigour" ? "#3b82f6" : "#a855f7" }}>
                      {h.bias === "speed" ? "⚡ SPEED" : h.bias === "rigour" ? "🔬 RIGOUR" : "⚖️ BALANCED"}
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#64748b" }}>{t(`scenarios.pacing_event_${h.eventId ?? 0}.${h.outcomeType ?? "speedOutcome"}.label`, h.choice)}</span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: 12, background: "#1e293b", borderRadius: 8 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#64748b" }}>{t("pacing.biasDistribution")}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#f97316" }}>⚡ {speedChoices}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#a855f7" }}>⚖️ {balancedChoices}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#3b82f6" }}>🔬 {rigourChoices}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#f97316", marginBottom: 10 }}>{t("pacing.coreInsight")}</div>
            <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: 14 }}>
              The pacing problem is not a puzzle to solve — it's a tension to manage. Every institution faces the same fundamental trade-off: act quickly enough to matter, or carefully enough to be right. The simulation demonstrates why "just regulate AI" is insufficient as a strategy. The <em style={{ color: "#e2e8f0" }}>how</em> of governance matters as much as the <em style={{ color: "#e2e8f0" }}>whether</em>, and the costs of both action and inaction are real and measurable.
            </p>
          </div>

          {/* ─── SHAREABLE RESULTS CARD ─── */}
          <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#f97316", marginBottom: 12 }}>{t("share.shareResult")}</div>
            <div style={{ background: "#0c0f14", border: `1px solid ${archetypeColor}33`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748b", letterSpacing: 1 }}>{t("pacing.myArchetype")}</div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: archetypeColor, marginTop: 4 }}>{archetype}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                {[
                  { label: "Bandwidth", val: state.bandwidth, icon: "📊", suffix: "%" },
                  { label: "Credibility", val: state.credibility, icon: "🏛️", suffix: "%" },
                  { label: "Public Trust", val: state.publicTrust, icon: "👥", suffix: "%" },
                  { label: "Capture Risk", val: state.captureRisk, icon: "🎯", suffix: "%" }
                ].map((m, i) => (
                  <div key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#94a3b8" }}>
                    {m.icon} {m.label}: <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{m.val}{m.suffix}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#64748b", marginBottom: 12 }}>
                ⚡ {speedChoices} speed · ⚖️ {balancedChoices} balanced · 🔬 {rigourChoices} rigour
              </div>
              <div style={{ paddingTop: 12, borderTop: "1px solid #1e2533", fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748b" }}>
                strategy.mobilis.studio — AI Governance Simulation
              </div>
            </div>
            <button onClick={copyResult} style={{ width: "100%", padding: "12px", background: copied ? "#10b981" : "#1e293b", color: copied ? "#0c0f14" : "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1, transition: "all 0.3s ease" }}>
              {copied ? t("share.copiedToClipboard") : t("share.copyResult")}
            </button>
          </div>

          {/* ─── FEEDBACK CAPTURE ─── */}
          {!feedbackSubmitted ? (
            <form name="simulation-feedback" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={e => { e.preventDefault(); submitFeedback(); }} style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 24, marginBottom: 20 }}>
              <input type="hidden" name="form-name" value="simulation-feedback" />
              <input type="hidden" name="tool" value="pacing-problem" />
              <input type="hidden" name="archetype" value={archetype} />
              <input name="bot-field" style={{ display: "none" }} />
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#f59e0b", marginBottom: 16 }}>{t("feedback.title")}</div>
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{t("feedback.changedThinking")}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                  {[t("feedback.yesSignificantly"), t("feedback.somewhat"), t("feedback.notReally")].map(opt => (
                    <button type="button" key={opt} onClick={() => setFeedbackThinking(opt)} style={{ padding: "8px 14px", background: feedbackThinking === opt ? "#f59e0b22" : "#0c0f14", border: `1px solid ${feedbackThinking === opt ? "#f59e0b" : "#1e2533"}`, borderRadius: 6, color: feedbackThinking === opt ? "#f59e0b" : "#94a3b8", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, transition: "all 0.2s ease" }}>{opt}</button>
                  ))}
                </div>
                <input type="hidden" name="changed-thinking" value={feedbackThinking || ""} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{t("feedback.groupSetting")}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                  {[t("feedback.withTeam"), t("feedback.inClass"), t("feedback.atWorkshop"), t("feedback.justExploring")].map(opt => (
                    <button type="button" key={opt} onClick={() => setFeedbackUseCase(opt)} style={{ padding: "8px 14px", background: feedbackUseCase === opt ? "#06b6d422" : "#0c0f14", border: `1px solid ${feedbackUseCase === opt ? "#06b6d4" : "#1e2533"}`, borderRadius: 6, color: feedbackUseCase === opt ? "#06b6d4" : "#94a3b8", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, transition: "all 0.2s ease" }}>{opt}</button>
                  ))}
                </div>
                <input type="hidden" name="use-case" value={feedbackUseCase || ""} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{t("feedback.facilitatorGuide")}</p>
                <p style={{ color: "#64748b", fontSize: 11, marginBottom: 8 }}>{t("feedback.facilitatorGuideDesc")}</p>
                <input type="email" name="email" value={feedbackEmail} onChange={e => setFeedbackEmail(e.target.value)} placeholder={t("feedback.emailPlaceholder")} style={{ width: "100%", padding: "10px 14px", background: "#0c0f14", border: "1px solid #1e2533", borderRadius: 8, color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
              </div>
              <button type="submit" disabled={(!feedbackThinking && !feedbackUseCase && !feedbackEmail) || feedbackSubmitting} style={{ width: "100%", padding: "12px", background: (feedbackThinking || feedbackUseCase || feedbackEmail) ? "linear-gradient(135deg, #f59e0b, #06b6d4)" : "#1e293b", color: (feedbackThinking || feedbackUseCase || feedbackEmail) ? "#0c0f14" : "#334155", border: "none", borderRadius: 8, cursor: (feedbackThinking || feedbackUseCase || feedbackEmail) ? "pointer" : "not-allowed", fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1, opacity: feedbackSubmitting ? 0.6 : 1 }}>
                {feedbackSubmitting ? t("feedback.sending") : t("feedback.submit")}
              </button>
            </form>
          ) : (
            <div style={{ background: "#141820", border: "1px solid #10b98133", borderRadius: 12, padding: 20, marginBottom: 20, textAlign: "center" as const }}>
              <span style={{ fontSize: 24 }}>🙏</span>
              <p style={{ color: "#10b981", fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, marginTop: 8 }}>{t("feedback.thankYou")}</p>
              <p style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>
                {feedbackEmail ? t("feedback.willSendGuide") : t("feedback.inputHelps")}
              </p>
            </div>
          )}

          {/* ─── FACILITATOR CTA ─── */}
          <div style={{ background: "linear-gradient(135deg, #f9731611, #06b6d411)", border: "1px solid #f9731633", borderRadius: 12, padding: 20, marginBottom: 20, textAlign: "center" as const }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🎓</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#e2e8f0", marginBottom: 8 }}>Run this with your team</div>
            <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, marginBottom: 12, maxWidth: 480, margin: "0 auto 12px" }}>
              These simulations are designed for group workshops. Assign real roles, separate your participants, and discover how your organization thinks about AI governance trade-offs.
            </p>
            <p style={{ color: "#64748b", fontFamily: "'DM Mono', monospace", fontSize: 10 }}>
              Workshop formats available: 15-minute demo · 1-hour session · 2-hour lifecycle arc
            </p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={restart} style={{ flex: 1, padding: "14px 24px", background: "#141820", color: "#e2e8f0", border: "1px solid #1e2533", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const }}>
              ↻ {t("pacing.runAgain")}
            </button>
            <button onClick={onBack} style={{ flex: 1, padding: "14px 24px", background: "#0c0f14", color: "#64748b", border: "1px solid #1e2533", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" as const }}>
              ← {t("nav.backToHome")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ev = EVENTS[currentEvent];
  const eventOutcomeType = sliderValue < 35 ? "speedOutcome" : sliderValue > 65 ? "rigourOutcome" : "balancedOutcome";
  const rawOutcome = ev[eventOutcomeType as keyof typeof ev] as any;
  const choiceLabel = t(`scenarios.pacing_event_${ev.id}.${eventOutcomeType}.label`, rawOutcome.label);
  const choiceDetail = t(`scenarios.pacing_event_${ev.id}.${eventOutcomeType}.detail`, rawOutcome.detail);

  return (
    <div style={S}>
      {headerBar}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, maxWidth: 960, margin: "0 auto" }} className="event-layout">
        <div>
          <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 20, position: "sticky" as const, top: 24 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#64748b", marginBottom: 16 }}>{t("pacing.institutionalHealth")}</div>
            <GaugeBar label="Bandwidth" value={state.bandwidth} color="#10b981" icon="📊" subtitle={getStatusLabel(state.bandwidth, "bandwidth")} />
            <GaugeBar label="Credibility" value={state.credibility} color="#f59e0b" icon="🏛️" subtitle={getStatusLabel(state.credibility, "credibility")} />
            <GaugeBar label="Public Trust" value={state.publicTrust} color="#3b82f6" icon="👥" subtitle={getStatusLabel(state.publicTrust, "publicTrust")} />
            <div style={{ borderTop: "1px solid #1e2533", marginTop: 12, paddingTop: 12 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#ef4444", marginBottom: 12 }}>⚠ {t("pacing.threatLevels")}</div>
              <GaugeBar label="Capture Risk" value={state.captureRisk} color="#ef4444" icon="🎯" subtitle={getStatusLabel(state.captureRisk, "captureRisk")} />
              <GaugeBar label="Obsolescence" value={state.obsolescenceRisk} color="#8b5cf6" icon="⏳" subtitle={getStatusLabel(state.obsolescenceRisk, "obsolescenceRisk")} />
            </div>
            {state.history.length > 0 && (
              <div style={{ borderTop: "1px solid #1e2533", marginTop: 12, paddingTop: 12 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#64748b", marginBottom: 6 }}>PAST DECISIONS</div>
                {state.history.map((h, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 10 }}>{h.bias === "speed" ? "⚡" : h.bias === "rigour" ? "🔬" : "⚖️"}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#64748b" }}>{t(`scenarios.pacing_event_${h.eventId ?? 0}.${h.outcomeType ?? "speedOutcome"}.label`, h.choice)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          {!showOutcome ? (
            <div style={{ opacity: animateIn ? 1 : 0, transition: "opacity 0.5s ease, transform 0.5s ease", transform: animateIn ? "translateY(0)" : "translateY(20px)" }}>
              <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 28, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }}>{ev.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#f97316" }}>{ev.category}</div>
                    <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, fontWeight: 400 }}>{t(`scenarios.pacing_event_${ev.id}.title`, ev.title)}</h2>
                  </div>
                </div>
                <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: 14 }}>{t(`scenarios.pacing_event_${ev.id}.description`, ev.description)}</p>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#10b981", background: "#10b98122", padding: "3px 8px", borderRadius: 4 }}>{t("pacing.bandwidthCost")}: {ev.bandwidthCost}%</span>
                </div>
              </div>
              <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 28 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#64748b", marginBottom: 8 }}>{t("pacing.yourResponse")}</div>
                <SpectrumSlider value={sliderValue} onChange={setSliderValue} disabled={false} />
                <div style={{ background: "#1e293b", borderRadius: 8, padding: 16, marginTop: 16, marginBottom: 20, borderLeft: `3px solid ${sliderValue < 35 ? "#f97316" : sliderValue > 65 ? "#3b82f6" : "#a855f7"}` }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color: sliderValue < 35 ? "#f97316" : sliderValue > 65 ? "#3b82f6" : "#a855f7", marginBottom: 6 }}>{choiceLabel}</div>
                  <p style={{ color: "#94a3b8", lineHeight: 1.6, fontSize: 13 }}>{choiceDetail}</p>
                </div>
                <button onClick={submitChoice} style={{ width: "100%", padding: "14px", background: sliderValue < 35 ? "#f97316" : sliderValue > 65 ? "#3b82f6" : "#a855f7", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const }}>
                  {t("pacing.commitDecision")} →
                </button>
              </div>
            </div>
          ) : (
            <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
              <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 28, marginBottom: 16, borderTop: `3px solid ${sliderValue < 35 ? "#f97316" : sliderValue > 65 ? "#3b82f6" : "#a855f7"}` }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#64748b", marginBottom: 8 }}>{t("pacing.immediateConsequence")}</div>
                <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontWeight: 400, marginBottom: 12 }}>{t(`scenarios.pacing_event_${outcomeData._eventId}.${outcomeData._type}.label`, outcomeData.label)}</h3>
                <div style={{ background: "#1e293b", borderRadius: 8, padding: 16, marginBottom: 16, borderLeft: "3px solid #f59e0b" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#f59e0b", marginBottom: 6, letterSpacing: 1 }}>📰 {t("pacing.headline")}</div>
                  <p style={{ color: "#e2e8f0", lineHeight: 1.6, fontSize: 14, fontStyle: "italic" as const }}>"{t(`scenarios.pacing_event_${outcomeData._eventId}.${outcomeData._type}.headline`, outcomeData.headline)}"</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Credibility", val: outcomeData.credibility, color: "#f59e0b" },
                    { label: "Public Trust", val: outcomeData.publicTrust, color: "#3b82f6" },
                    { label: "Capture Risk", val: outcomeData.capture, color: "#ef4444", invert: true },
                    { label: "Obsolescence", val: outcomeData.obsolescence, color: "#8b5cf6", invert: true }
                  ].map((m, i) => {
                    const isGood = m.invert ? m.val < 0 : m.val > 0;
                    const isBad = m.invert ? m.val > 0 : m.val < 0;
                    return (
                      <div key={i} style={{ background: "#0c0f14", borderRadius: 8, padding: 12, border: "1px solid #1e2533" }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#64748b" }}>{m.label}</div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700, marginTop: 4, color: isGood ? "#10b981" : isBad ? "#ef4444" : "#64748b" }}>
                          {m.val > 0 ? "+" : ""}{m.val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button onClick={nextEvent} style={{ width: "100%", padding: "14px", background: "#141820", color: "#e2e8f0", border: "1px solid #1e2533", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const }}>
                {currentEvent >= EVENTS.length - 1 ? `${t("pacing.viewDebrief")} →` : `${t("pacing.nextCrisis")} →`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
