import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTranslatedCrisis } from "./useTranslatedCrisis";
import WORKSHOP_SCENARIOS from "./workshop-scenarios";
import { track } from "./analytics";
import LanguageToggle from "./LanguageToggle";

// ─── ROLES ───────────────────────────────────────────────
const ROLES = [
  {
    id: "regulator",
    name: "The Regulator",
    icon: "🏛️",
    color: "#f59e0b",
    bg: "#f59e0b18",
    desc: "You set policy and have formal authority to act. Your objective is public safety and institutional credibility.",
    role: "You set policy and have formal authority to act. Your objective is public safety and institutional credibility.",
    incentive: "Political pressure to act fast OR appear measured. Your legitimacy depends on due process, but the crisis won't wait for process."
  },
  {
    id: "platform",
    name: "The Platform",
    icon: "📱",
    color: "#06b6d4",
    bg: "#06b6d418",
    desc: "You control content distribution and user access. Your objective is a safe, trustworthy platform ecosystem.",
    role: "You control content distribution and user access. Your objective is a safe, trustworthy platform ecosystem.",
    incentive: "Revenue depends on engagement and growth. Legal liability pushes toward caution. Acting alone while competitors don't costs you users."
  },
  {
    id: "journalist",
    name: "The Journalist",
    icon: "📰",
    color: "#10b981",
    bg: "#10b98118",
    desc: "You shape the public narrative through investigation and reporting. Your objective is informing the public accurately.",
    role: "You shape the public narrative through investigation and reporting. Your objective is informing the public accurately.",
    incentive: "Editorial pressure to publish fast and first. Competitor outlets are working the same story. Speed and accuracy pull in opposite directions."
  },
  {
    id: "ailab",
    name: "The AI Lab",
    icon: "🔬",
    color: "#a855f7",
    bg: "#a855f718",
    desc: "You develop the technology and hold unique technical knowledge. Your objective is responsible development and deployment.",
    role: "You develop the technology and hold unique technical knowledge. Your objective is responsible development and deployment.",
    incentive: "Transparency has competitive costs. Competitors who don't share safety findings gain an advantage. Legal exposure increases with disclosure."
  },
];

const METRICS_INFO = [
  { key: "integrity", label: "Information Integrity", icon: "🎯", color: "#06b6d4", desc: "Did accurate information reach the public in time to matter? Measures whether the collective response improved or degraded the information environment." },
  { key: "trust", label: "Public Trust", icon: "👥", color: "#10b981", desc: "Does the public trust institutions more or less after this response? Eroded by perceived cover-ups, overreach, or incompetence — rebuilt slowly through transparency and consistency." },
  { key: "legitimacy", label: "Institutional Legitimacy", icon: "⚖️", color: "#f59e0b", desc: "Did institutions act within their mandates and follow due process? High legitimacy means actions will survive legal challenge and set good precedent." },
  { key: "rights", label: "Individual Rights", icon: "🛡️", color: "#a855f7", desc: "Were civil liberties — speech, privacy, due process — protected? Measures whether the response respected fundamental rights even under crisis pressure." }
];

// ─── CRISES ──────────────────────────────────────────────
const BUILT_IN_CRISES = [
  {
    id: "synthetic_candidate",
    title: "The Synthetic Candidate",
    category: "ELECTORAL INTEGRITY",
    icon: "🗳️",
    publicBriefing: "A hyper-realistic video of a mayoral candidate making inflammatory statements surfaces 5 days before election day. It has been viewed 8 million times in 12 hours. The candidate's team has denied the statements but offered no technical evidence. Public confusion is escalating rapidly.",
    stakes: "An election outcome may be decided by whether this video is believed.",
    designNote: "This scenario tests coordination under extreme time pressure with high political stakes. The core tension: every actor has a piece of the puzzle, but sharing information has costs unique to their position.",
    roleIntel: {
      regulator: {
        classification: "CONFIDENTIAL — REGULATORY ASSESSMENT",
        bullets: [
          "Current election integrity statutes do not specifically address AI-generated content — no legal precedent exists for mandating removal.",
          "Your agency's public trust rating has dropped 11 points this quarter after a previous intervention was perceived as partisan.",
          "Internal polling: 34% of voters have already seen the video. Of those, 61% believe it is real.",
          "The opposing campaign is publicly demanding you act. Inaction will be framed as complicity."
        ]
      },
      platform: {
        classification: "INTERNAL — CONTENT INTEGRITY TEAM",
        bullets: [
          "Automated detection systems flag the video as 87% likely synthetic — but this model has a 12% false positive rate on political content.",
          "The video is being shared at 420 shares/minute across your platform, with 74% of reshares adding commentary like 'I knew it.'",
          "Removing the video will trigger immediate accusations of election interference from multiple political factions.",
          "Three competitor platforms have not removed it. If you act alone, traffic migrates and the video spreads regardless."
        ]
      },
      journalist: {
        classification: "EDITORIAL — SOURCE BRIEFING",
        bullets: [
          "Your forensic analysis team can produce a definitive authenticity assessment — but they need 72 hours minimum.",
          "A former employee of an AI lab has contacted you claiming to know the generation method, but insists on anonymity.",
          "Your editor is pushing to publish within 6 hours. A rival outlet is preparing a story framing the video as authentic.",
          "Publishing too early with caveats still amplifies the video. Waiting too long means the rival outlet defines the narrative."
        ]
      },
      ailab: {
        classification: "INTERNAL — TECHNICAL ASSESSMENT",
        bullets: [
          "The video's generation signature is consistent with a model fine-tuned on your architecture. Likelihood: high that your tools were used (via API).",
          "You have a detection tool that could identify this specific generation method with 97% accuracy — but releasing it reveals proprietary model architecture.",
          "Your legal team warns that any public statement could be construed as admission of liability.",
          "A private disclosure to the regulator and platform would help them act, but creates a paper trail that competitors and litigants could subpoena."
        ]
      }
    },
    options: {
      regulator: [
        { id: "reg_advisory", label: "Issue Public Advisory", detail: "Release a formal advisory labeling the video 'suspected AI-generated content' based on available indicators.", tension: "Speaking before evidence is conclusive vs. silence that implies the video is real.", tradeoff: "INTEGRITY ↑ TRUST ↓ — Transparent, but may appear to prejudge before evidence is conclusive. Could damage credibility if wrong.", stance: "transparent", scores: { integrity: 6, trust: -4, legitimacy: 3, rights: -3 } },
        { id: "reg_mandate", label: "Emergency Platform Review", detail: "Invoke emergency authority to mandate platforms review and label the content within 24 hours.", tension: "Protecting the election vs. setting a precedent for government-directed content removal.", tradeoff: "LEGITIMACY ↓↓ RIGHTS ↓↓ — Sets dangerous precedent for government content directives. High integrity gain if correct, catastrophic if not.", stance: "restrictive", scores: { integrity: 4, trust: -8, legitimacy: -5, rights: -8 } },
        { id: "reg_wait", label: "Await Formal Evidence", detail: "Announce an investigation is underway but take no action until forensic evidence is available.", tension: "Institutional credibility from due process vs. the election that won't wait for due process.", tradeoff: "LEGITIMACY ↑ INTEGRITY ↓ — Procedurally correct but the election won't wait. If the video is fake, delay equals complicity.", stance: "cautious", scores: { integrity: -3, trust: 2, legitimacy: 6, rights: 5 } }
      ],
      platform: [
        { id: "plat_remove", label: "Remove the Video", detail: "Take down the video based on 87% synthetic detection confidence.", tension: "Stopping the spread vs. suppressing potentially authentic content 5 days before an election.", tradeoff: "INTEGRITY ↑ RIGHTS ↓↓ — Stops spread but 12% false positive rate means you might suppress authentic content 5 days before an election.", stance: "restrictive", scores: { integrity: 5, trust: -6, legitimacy: -4, rights: -7 } },
        { id: "plat_label", label: "Add Context Label", detail: "Append an interstitial: 'Automated systems have flagged this content for review.'", tension: "Preserving access vs. whether a label actually changes anyone's mind about what they've already decided to believe.", tradeoff: "BALANCED — Preserves access while adding friction. But labels are often ignored, and labeling itself may be seen as editorializing.", stance: "transparent", scores: { integrity: 4, trust: 2, legitimacy: 3, rights: 3 } },
        { id: "plat_none", label: "Maintain Current Policy", detail: "Let existing user-reporting mechanisms handle it.", tension: "Platform neutrality as a principle vs. being the primary vector for an election-influencing deepfake.", tradeoff: "RIGHTS ↑ INTEGRITY ↓↓ — Principled but passive. You're the primary distribution vector — inaction is itself a consequential choice.", stance: "cautious", scores: { integrity: -5, trust: -2, legitimacy: 2, rights: 6 } }
      ],
      journalist: [
        { id: "jour_break", label: "Publish Immediately", detail: "Run the story now: 'Experts raise serious questions about candidate video.'", tension: "Being first vs. amplifying a deepfake to audiences who hadn't seen it yet.", tradeoff: "RIGHTS ↑ INTEGRITY ↓ — Beats the rival but evidence is incomplete. Amplifies the video to people who hadn't seen it.", stance: "transparent", scores: { integrity: -2, trust: -3, legitimacy: -2, rights: 4 } },
        { id: "jour_wait", label: "Wait for Forensics", detail: "Hold the story 72 hours until your team delivers definitive analysis.", tension: "Rigorous reporting vs. the rival outlet that is writing the definitive account right now.", tradeoff: "INTEGRITY ↑↑ TRUST ↑ — Journalistically rigorous but the rival outlet may define the narrative in the meantime.", stance: "cautious", scores: { integrity: 7, trust: 4, legitimacy: 5, rights: 2 } },
        { id: "jour_source", label: "Publish with Anonymous Source", detail: "Run the story citing the anonymous former lab employee.", tension: "Speed and exclusivity vs. building a story on a single source you cannot independently verify.", tradeoff: "INTEGRITY ± LEGITIMACY ↓ — Faster than forensics but relies on a single unverified source. Source could be wrong or have an agenda.", stance: "restrictive", scores: { integrity: 1, trust: -2, legitimacy: -3, rights: 2 } }
      ],
      ailab: [
        { id: "lab_public", label: "Release Detection Tool", detail: "Open-source the detection tool so anyone can verify.", tension: "Maximum public benefit vs. the proprietary architecture this tool reveals to every competitor.", tradeoff: "ALL METRICS ↑ — Maximum public benefit. But reveals proprietary architecture, aids competitors, and may increase legal exposure.", stance: "transparent", scores: { integrity: 8, trust: 6, legitimacy: 4, rights: 5 } },
        { id: "lab_private", label: "Private Disclosure", detail: "Share detection results confidentially with the regulator and platform.", tension: "Helping them act without public exposure vs. creating a paper trail that litigants can subpoena.", tradeoff: "INTEGRITY ↑ TRUST ± — Helps them act without public exposure, but creates a subpoena-able trail and limits broader accountability.", stance: "cautious", scores: { integrity: 4, trust: 0, legitimacy: 2, rights: 2 } },
        { id: "lab_silent", label: "Issue General Statement", detail: "Publish a generic advisory about synthetic media risks without referencing this specific video.", tension: "Legal safety vs. the fact that a useless statement still uses up your credibility as a speaker.", tradeoff: "RIGHTS ↑ ALL ELSE ↓ — Legally safe but practically useless. Protects the lab while the public remains confused.", stance: "cautious", scores: { integrity: -4, trust: -5, legitimacy: -2, rights: 3 } }
      ]
    },
    interactions: [
      { pair: ["reg_advisory", "plat_label"], type: "synergy", label: "Reinforcing Transparency", desc: "Government advisory + platform label created a consistent, credible signal. Public received the same message from two independent authorities — rare institutional alignment.", mod: { integrity: 6, trust: 5 } },
      { pair: ["reg_advisory", "lab_public"], type: "synergy", label: "Evidence-Backed Action", desc: "The advisory gained immediate credibility when the detection tool confirmed it. A model case for institutional coordination in real-time.", mod: { integrity: 7, trust: 6, legitimacy: 5 } },
      { pair: ["reg_mandate", "plat_remove"], type: "conflict", label: "Censorship Narrative", desc: "Government-ordered removal triggered massive backlash. The video became a symbol of institutional overreach and went viral on alternative platforms.", mod: { trust: -10, rights: -8, legitimacy: -6 } },
      { pair: ["reg_wait", "plat_none"], type: "conflict", label: "Coordination Vacuum", desc: "With no institutional actor willing to move first, the information vacuum was filled by partisan interpreters. The video was treated as authentic by default.", mod: { integrity: -8, trust: -5 } },
      { pair: ["jour_wait", "lab_public"], type: "synergy", label: "Verified Reporting", desc: "The journalist's patience paid off — the open detection tool provided definitive evidence for a gold-standard investigative piece published before election day.", mod: { integrity: 8, trust: 5, legitimacy: 4 } },
      { pair: ["jour_break", "lab_silent"], type: "conflict", label: "Speculation Without Evidence", desc: "The breaking story raised questions but the lab's silence meant no one could answer them. Speculation filled the void.", mod: { integrity: -5, trust: -4 } },
      { pair: ["plat_label", "jour_source"], type: "synergy", label: "Convergent Signals", desc: "Platform labels + anonymous source reporting created enough doubt to slow the video's influence, though neither was definitive alone.", mod: { integrity: 3, trust: 2 } },
    ]
  },
  {
    id: "invisible_epidemic",
    title: "The Invisible Epidemic",
    category: "PUBLIC HEALTH × AI SAFETY",
    icon: "💊",
    publicBriefing: "Social media reports are emerging that an AI health chatbot — used by 4 million people — may have been providing subtly incorrect dosage information for a common blood pressure medication. Three hospitalizations have been loosely linked but no official investigation has begun. The chatbot's parent company has not commented.",
    stakes: "Tens of thousands may be affected. But a false alarm could destroy public trust in AI health tools that millions rely on daily.",
    designNote: "This scenario tests the tension between precautionary action and evidence-based response. The cover-up dynamic between platform and lab is the key coordination trap.",
    roleIntel: {
      regulator: {
        classification: "CONFIDENTIAL — HEALTH SAFETY REVIEW",
        bullets: [
          "You've received 7 formal adverse event reports in 3 weeks — above baseline but below the threshold that typically triggers emergency review.",
          "Your investigation backlog is 14 months. Emergency authority requires a formal 'imminent threat' determination you lack evidence for.",
          "The pharmaceutical industry is lobbying against a broad AI health tool moratorium, arguing it would set back telemedicine by years.",
          "A leaked internal memo suggests your agency was aware of chatbot accuracy concerns 6 months ago but deprioritized the review."
        ]
      },
      platform: {
        classification: "INTERNAL — PRODUCT SAFETY REVIEW",
        bullets: [
          "You host the chatbot. Internal analysis: 89,000 dosage queries for this medication in the past month. User satisfaction: 4.7/5 stars.",
          "Your trust & safety team identified the dosage discrepancy 10 days ago. A patch was developed but deploying it implicitly confirms the error existed.",
          "The chatbot has a disproportionate user base among elderly patients and non-English speakers who have fewer alternative information sources.",
          "Your legal team: proactive disclosure could trigger a class-action lawsuit. Estimated liability exposure: $200M–$800M."
        ]
      },
      journalist: {
        classification: "EDITORIAL — INVESTIGATION BRIEFING",
        bullets: [
          "You've interviewed 4 patients who experienced adverse effects consistent with incorrect dosing. Two required hospitalization.",
          "A source inside the platform company has shared internal Slack messages showing engineers discussed the error weeks ago.",
          "Hospital admission data for hypertensive crises in regions with high chatbot adoption is up 23% — suggestive but not conclusive.",
          "Your editor wants the story in 48 hours. A competitor is preparing a 'miracle of AI healthcare' puff piece that may inoculate the company."
        ]
      },
      ailab: {
        classification: "INTERNAL — MODEL EVALUATION",
        bullets: [
          "Your foundation model powers the chatbot's medical responses. Internal testing confirmed the dosage error 3 weeks ago — it stems from conflicting training data.",
          "A patch is ready and tested. Deploying it silently fixes the issue but confirms your model was the source.",
          "Your API terms of service place liability on the deployer (the platform), not on you. But reputationally, the distinction won't matter.",
          "Two other health chatbots built on your API may have similar issues. You haven't tested them yet."
        ]
      }
    },
    options: {
      regulator: [
        { id: "reg_emergency", label: "Declare Imminent Threat", detail: "Invoke emergency powers to mandate the chatbot be suspended pending investigation.", tension: "Acting on available evidence to protect the public vs. stretching legal authority beyond what the evidence supports.", tradeoff: "INTEGRITY ↑ LEGITIMACY ↓ — Protects the public immediately but stretches legal authority. May not survive court challenge.", stance: "restrictive", scores: { integrity: 5, trust: 3, legitimacy: -4, rights: -3 } },
        { id: "reg_advisory2", label: "Issue Safety Advisory", detail: "Publish a public advisory recommending users verify AI health advice with their physician.", tension: "Measured and defensible response vs. whether it actually reaches the elderly and non-English speakers most at risk.", tradeoff: "BALANCED — Measured and defensible. But may not reach the most vulnerable users who need it most.", stance: "transparent", scores: { integrity: 3, trust: 2, legitimacy: 4, rights: 3 } },
        { id: "reg_investigate", label: "Launch Formal Investigation", detail: "Open a standard investigation process.", tension: "Procedural legitimacy vs. the people who may be harmed during the months this takes.", tradeoff: "LEGITIMACY ↑↑ INTEGRITY ↓ — Procedurally sound but takes months. People may be harmed in the interim.", stance: "cautious", scores: { integrity: -2, trust: -3, legitimacy: 5, rights: 4 } }
      ],
      platform: [
        { id: "plat_suspend", label: "Suspend the Chatbot", detail: "Take the chatbot offline immediately with a public statement.", tension: "Protecting users now vs. the legal liability that public acknowledgment immediately creates.", tradeoff: "INTEGRITY ↑↑ TRUST ↑ — Protects users and demonstrates accountability, but confirms the problem publicly and maximizes legal exposure.", stance: "transparent", scores: { integrity: 7, trust: 4, legitimacy: 3, rights: 2 } },
        { id: "plat_silent_patch", label: "Deploy Silent Patch", detail: "Fix the dosage error without public acknowledgment.", tension: "Users protected going forward vs. the cover-up that becomes the story when it's discovered later.", tradeoff: "ALL METRICS ↓ — Users are protected going forward but past harm is unaddressed. If discovered later, the cover-up becomes the scandal.", stance: "cautious", scores: { integrity: -3, trust: -6, legitimacy: -5, rights: -2 } },
        { id: "plat_disclaim", label: "Add Disclaimer Layer", detail: "Add prominent disclaimers to all medical responses: 'This is not medical advice.'", tension: "Shifting liability vs. the users who already received wrong dosages and need more than a disclaimer.", tradeoff: "RIGHTS ± INTEGRITY ↓ — Shifts liability but doesn't fix the error. Disclaimers don't help users who already received wrong dosages.", stance: "cautious", scores: { integrity: -4, trust: -3, legitimacy: -2, rights: 1 } }
      ],
      journalist: [
        { id: "jour_investigate2", label: "Publish Full Investigation", detail: "Run the story with patient interviews, hospital data, and internal Slack messages.", tension: "Comprehensive rigor vs. the company that will dispute every detail and use that dispute to muddy the story.", tradeoff: "INTEGRITY ↑↑ RIGHTS ↑ — Comprehensive and rigorous. But the company will dispute every detail and frame it as anti-AI.", stance: "transparent", scores: { integrity: 7, trust: 3, legitimacy: 3, rights: 4 } },
        { id: "jour_tip", label: "Tip Off the Regulator", detail: "Share your evidence with the regulatory agency before publishing.", tension: "Giving regulators a head start vs. the puff piece that defines the story while you wait.", tradeoff: "LEGITIMACY ↑ — Gives the regulator a head start. But your competitor may publish the puff piece first, making your story look reactive.", stance: "cautious", scores: { integrity: 4, trust: 3, legitimacy: 5, rights: 2 } },
        { id: "jour_sensational", label: "Publish Alarm Headline", detail: "Lead with 'AI Chatbot May Be Poisoning Patients.'", tension: "Forcing immediate action vs. panicking 4 million users who may abruptly stop legitimate medication.", tradeoff: "TRUST ↓↓ RIGHTS ↓ — Forces action but risks panic among 4 million users who may abruptly stop legitimate medication.", stance: "restrictive", scores: { integrity: -2, trust: -5, legitimacy: -4, rights: 1 } }
      ],
      ailab: [
        { id: "lab_full_disclosure", label: "Full Public Disclosure", detail: "Publish a transparency report acknowledging the training data conflict, detailing affected systems, and releasing the patch.", tension: "Industry-leading accountability vs. the lawsuits and competitive losses that follow from self-incrimination.", tradeoff: "ALL METRICS ↑↑ — Industry-leading accountability. But reveals competitive information and makes lawsuits easier.", stance: "transparent", scores: { integrity: 8, trust: 7, legitimacy: 5, rights: 4 } },
        { id: "lab_quiet_fix", label: "Patch Quietly via API", detail: "Push the fix through the API so all downstream chatbots are corrected silently.", tension: "Users protected going forward vs. a failure mode that's never examined and may be replicated in other domains.", tradeoff: "ALL METRICS ↓ — Users protected going forward but the failure mode is never examined. Other domains may have identical errors.", stance: "cautious", scores: { integrity: -1, trust: -4, legitimacy: -3, rights: 1 } },
        { id: "lab_downstream", label: "Notify Deployers Only", detail: "Alert the platform and other API customers about the issue and provide the patch privately.", tension: "Distributing responsibility to those closest to users vs. deployers who may not act with the urgency the situation requires.", tradeoff: "INTEGRITY ± — Distributes responsibility but delays public awareness. Deployers may not act quickly.", stance: "cautious", scores: { integrity: 2, trust: -2, legitimacy: 0, rights: 2 } }
      ]
    },
    interactions: [
      { pair: ["plat_suspend", "lab_full_disclosure"], type: "synergy", label: "Coordinated Accountability", desc: "Platform suspension + lab transparency report created a model for responsible AI incident response. Both took hits but ecosystem trust increased.", mod: { integrity: 8, trust: 8, legitimacy: 6 } },
      { pair: ["plat_silent_patch", "lab_quiet_fix"], type: "conflict", label: "The Cover-Up", desc: "Both silently fixed the issue. When the journalist eventually broke the story, the cover-up became the scandal — worse than the original error.", mod: { trust: -12, legitimacy: -8, integrity: -6 } },
      { pair: ["reg_emergency", "jour_sensational"], type: "conflict", label: "Panic Cascade", desc: "Emergency declaration + sensational headline caused 340,000 users to stop medication abruptly. ER surge far exceeded the original chatbot error.", mod: { integrity: -6, trust: -5, rights: -7 } },
      { pair: ["reg_advisory2", "jour_investigate2"], type: "synergy", label: "Informed Response", desc: "Measured advisory directed people to doctors while investigative reporting provided the evidence base. Informed response without panic.", mod: { integrity: 5, trust: 5, legitimacy: 4 } },
      { pair: ["jour_tip", "reg_advisory2"], type: "synergy", label: "Journalism-Regulation Pipeline", desc: "Journalist's tip gave the regulator early warning, enabling a faster, better-informed advisory. The subsequent investigation was strengthened by official validation.", mod: { integrity: 4, trust: 4, legitimacy: 5 } },
      { pair: ["plat_disclaim", "lab_downstream"], type: "conflict", label: "Responsibility Hot Potato", desc: "Both deferred to each other. Users received disclaimers but no fix. The error persisted for 3 additional weeks.", mod: { integrity: -5, trust: -4, legitimacy: -3 } },
    ]
  }
];

// ─── GAME LOGIC ──────────────────────────────────────────
function computeOutcome(crisis: any, decisions: any) {
  let scores: any = { integrity: 0, trust: 0, legitimacy: 0, rights: 0 };
  const chosenOptions: any = {};
  const triggeredInteractions: any[] = [];
  for (const roleId of Object.keys(decisions)) {
    const optionId = decisions[roleId];
    const opts = crisis.options[roleId];
    const opt = opts.find((o: any) => o.id === optionId);
    if (opt) {
      chosenOptions[roleId] = opt;
      for (const k of Object.keys(scores)) scores[k] += (opt.scores[k] || 0);
    }
  }
  const chosenIds = Object.values(decisions);
  for (let interIdx = 0; interIdx < (crisis.interactions || []).length; interIdx++) {
    const interaction = crisis.interactions[interIdx];
    if (chosenIds.includes(interaction.pair[0]) && chosenIds.includes(interaction.pair[1])) {
      triggeredInteractions.push({ ...interaction, _idx: interIdx });
      for (const k of Object.keys(scores)) scores[k] += (interaction.mod[k] || 0);
    }
  }
  const synergies = triggeredInteractions.filter((i: any) => i.type === "synergy").length;
  const conflicts = triggeredInteractions.filter((i: any) => i.type === "conflict").length;
  for (const k of Object.keys(scores)) scores[k] = Math.max(-30, Math.min(30, scores[k]));
  const totalScore = Object.values(scores).reduce((a: any, b: any) => (a as number) + (b as number), 0) as number;

  // Base grade from interactions
  let baseGradeVal: number;
  if (synergies >= 2 && conflicts === 0) baseGradeVal = 4; // A
  else if (synergies > conflicts) baseGradeVal = 3; // B
  else if (synergies === 0 && conflicts === 0) baseGradeVal = 2; // C
  else if (conflicts > synergies && synergies > 0) baseGradeVal = 1; // D
  else baseGradeVal = 0; // F

  // Score modifier: strong positive scores bump up, strong negative bump down
  if (totalScore >= 20) baseGradeVal = Math.min(4, baseGradeVal + 1);
  else if (totalScore >= 10) baseGradeVal = Math.min(4, baseGradeVal + 0.5);
  else if (totalScore <= -20) baseGradeVal = Math.max(0, baseGradeVal - 1);
  else if (totalScore <= -10) baseGradeVal = Math.max(0, baseGradeVal - 0.5);

  const gradeMap: { [key: string]: [string, string] } = {
    "4": ["A", "Exceptional coordination. Institutional actors reinforced each other and collective impact was strongly positive."],
    "3.5": ["A-", "Strong coordination with good outcomes. Minor gaps but overall highly effective."],
    "3": ["B", "Positive coordination. More synergies than conflicts, though some damage accumulated."],
    "2.5": ["B-", "Moderate coordination. Positive intent but mixed collective outcomes."],
    "2": ["C", "Isolated action. Each institution acted independently — outcomes reflect individual choices, not coordination."],
    "1.5": ["C-", "Weak coordination with negative drift. Independent action produced poor collective results."],
    "1": ["D", "Poor coordination. Actions mostly worked against each other."],
    "0.5": ["D-", "Very poor coordination. Significant institutional conflicts with damaging outcomes."],
    "0": ["F", "Coordination failure. Actions actively undermined each other with severe consequences."]
  };

  const gradeKey = String(Math.round(baseGradeVal * 2) / 2);
  const [coordinationGrade, coordinationDesc] = gradeMap[gradeKey] || gradeMap["2"];
  return { scores, triggeredInteractions, chosenOptions, coordinationGrade, coordinationDesc };
}

function computeCounterfactuals(crisis: any, decisions: any, currentOutcome: any) {
  const counterfactuals: any[] = [];
  for (const roleId of Object.keys(decisions)) {
    const opts = crisis.options[roleId];
    const currentOptId = decisions[roleId];
    for (const opt of opts) {
      if (opt.id === currentOptId) continue;
      const altDecisions = { ...decisions, [roleId]: opt.id };
      const altOutcome = computeOutcome(crisis, altDecisions);
      const totalCurrent = Object.values(currentOutcome.scores).reduce((a: any, b: any) => a + b, 0) as number;
      const totalAlt = Object.values(altOutcome.scores).reduce((a: any, b: any) => a + b, 0) as number;
      const diff = totalAlt - totalCurrent;
      // Only show improvements (positive diff) — "what could have gone better"
      if (diff >= 5) {
        const role = ROLES.find(r => r.id === roleId);
        counterfactuals.push({
          roleId,
          roleName: role!.name,
          roleIcon: role!.icon,
          roleColor: role!.color,
          fromOptId: currentOptId,
          toOptId: opt.id,
          fromLabel: currentOutcome.chosenOptions[roleId]?.label,
          toLabel: opt.label,
          diff,
          newGrade: altOutcome.coordinationGrade,
          newInteractions: altOutcome.triggeredInteractions
        });
      }
    }
  }
  counterfactuals.sort((a: any, b: any) => b.diff - a.diff);
  return counterfactuals.slice(0, 3);
}

// ─── AI SCENARIO GENERATOR ───────────────────────────────
const SCENARIO_PROMPT = `You are a scenario designer for an AI governance simulation game called "The Epistemic Commons." Generate a complete, playable crisis scenario.

RESPOND WITH ONLY VALID JSON. No markdown, no backticks, no preamble.

The scenario must follow this exact structure:
{
  "id": "snake_case_id",
  "title": "Short evocative title",
  "category": "CATEGORY IN CAPS",
  "icon": "single emoji",
  "publicBriefing": "2-3 sentence public briefing all players see. Specific numbers and details make it feel real.",
  "stakes": "One sentence explaining what's at stake.",
  "designNote": "One sentence about what coordination dynamic this scenario tests.",
  "roleIntel": {
    "regulator": { "classification": "CONFIDENTIAL — ...", "bullets": ["4 specific intel items with numbers and details"] },
    "platform": { "classification": "INTERNAL — ...", "bullets": ["4 items"] },
    "journalist": { "classification": "EDITORIAL — ...", "bullets": ["4 items"] },
    "ailab": { "classification": "INTERNAL — ...", "bullets": ["4 items"] }
  },
  "options": {
    "regulator": [
      { "id": "unique_id", "label": "Short label", "detail": "One sentence description.", "tradeoff": "METRIC ↑ METRIC ↓ — Explanation of the trade-off.", "stance": "transparent|restrictive|cautious", "scores": { "integrity": -10 to 10, "trust": -10 to 10, "legitimacy": -10 to 10, "rights": -10 to 10 } }
    ],
    "platform": [3 options same format],
    "journalist": [3 options same format],
    "ailab": [3 options same format]
  },
  "interactions": [
    { "pair": ["option_id_1", "option_id_2"], "type": "synergy|conflict", "label": "Short label", "desc": "What happens when these two choices combine.", "mod": { "integrity": 0, "trust": 0, "legitimacy": 0, "rights": 0 } }
  ]
}

CRITICAL RULES:
- Each role gets exactly 3 options with unique IDs
- Each option must have one "transparent", one "restrictive", one "cautious" stance
- Include 4-6 interactions (mix of synergies and conflicts)
- Interaction pairs must reference actual option IDs from the options
- Scores range from -10 to 10. Interaction mods range from -12 to 8
- Every option must have real trade-offs — no obviously correct answers
- Intel must be ASYMMETRIC — each role knows something others don't
- Be specific: use numbers, percentages, dollar amounts, timelines`;

async function generateScenario(context: string) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: SCENARIO_PROMPT,
        messages: [{ role: "user", content: `Generate a crisis scenario about: ${context}\n\nRespond with ONLY the JSON object, nothing else.` }]
      })
    });
    const data = await response.json();
    const text = data.content?.map((c: any) => c.text || "").join("") || "";
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Generation error:", err);
    return null;
  }
}

// ─── UI HELPERS ──────────────────────────────────────────
function MetricBar({ label, value, maxVal = 30, icon, color }: any) {
  const pct = Math.abs(value) / maxVal * 100;
  const isPositive = value > 0;
  const barColor = isPositive ? "#10b981" : value < 0 ? "#ef4444" : "#64748b";
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase" }}>{icon} {label}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: barColor }}>{value > 0 ? "+" : ""}{value}</span>
      </div>
      <div style={{ height: 6, background: "#1e293b", borderRadius: 3, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#334155" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: isPositive ? "50%" : `${50 - pct / 2}%`, width: `${pct / 2}%`, background: barColor, borderRadius: 3, transition: "all 0.8s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

function RoleCard({ role, isActive, isCompleted }: any) {
  const { t } = useTranslation();
  return (
    <div style={{ background: isActive ? role.bg : "#141820", border: `1px solid ${isActive ? role.color : isCompleted ? "#334155" : "#1e2533"}`, borderRadius: 10, padding: "10px 12px", opacity: isCompleted && !isActive ? 0.6 : 1, transition: "all 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>{role.icon}</span>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: role.color, letterSpacing: 1 }}>{role.name}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: isCompleted ? "#10b981" : isActive ? role.color : "#64748b", marginTop: 1 }}>
            {isCompleted ? `✓ ${t("govGame.committed")}` : isActive ? `▸ ${t("govGame.yourTurn")}` : t("govGame.waiting")}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ROLES, BUILT_IN_CRISES, computeOutcome };

// ─── MAIN ────────────────────────────────────────────────
export default function EpistemicCommonsV2({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState("intro");
  const [crises, setCrises] = useState([...BUILT_IN_CRISES, ...WORKSHOP_SCENARIOS]);
  const [crisisIdx, setCrisisIdx] = useState(0);
  const [roleIdx, setRoleIdx] = useState(0);
  const [decisions, setDecisions] = useState<any>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [outcomes, setOutcomes] = useState<any[]>([]);
  const [animIn, setAnimIn] = useState(false);
  const [showAllIntel, setShowAllIntel] = useState(false);
  const [showCounterfactuals, setShowCounterfactuals] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const [genContext, setGenContext] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [genPreview, setGenPreview] = useState<any>(null);
  // Scenario selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [queue, setQueue] = useState<string[]>([]);
  // Debrief engagement state
  const [copied, setCopied] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackThinking, setFeedbackThinking] = useState<string | null>(null);
  const [feedbackUseCase, setFeedbackUseCase] = useState<string | null>(null);
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  useEffect(() => { setAnimIn(false); const t = setTimeout(() => setAnimIn(true), 50); return () => clearTimeout(t); }, [phase, roleIdx, crisisIdx]);

  useEffect(() => {
    if (phase === "debrief" && outcomes.length > 0) {
      const gradeToVal: Record<string, number> = { A: 4, "A-": 3.5, B: 3, "B-": 2.5, C: 2, "C-": 1.5, D: 1, "D-": 0.5, F: 0 };
      const grades = outcomes.map((o: any) => o.coordinationGrade);
      const avgGradeVal = grades.reduce((s: number, g: string) => s + (gradeToVal[g] ?? 2), 0) / grades.length;
      const overallGrade = avgGradeVal >= 3.75 ? "A" : avgGradeVal >= 3.25 ? "A-" : avgGradeVal >= 2.75 ? "B" : avgGradeVal >= 2.25 ? "B-" : avgGradeVal >= 1.75 ? "C" : avgGradeVal >= 1.25 ? "C-" : avgGradeVal >= 0.75 ? "D" : avgGradeVal >= 0.25 ? "D-" : "F";
      let archetype = "The Institutional Fragmentation";
      if (overallGrade === "A") archetype = "The Aligned Ecosystem";
      else if (overallGrade === "B") archetype = "The Imperfect Coalition";
      else if (overallGrade === "C") archetype = "The Fog of Governance";
      const totalSynergies = outcomes.reduce((s: number, o: any) => s + o.triggeredInteractions.filter((i: any) => i.type === "synergy").length, 0);
      const totalConflicts = outcomes.reduce((s: number, o: any) => s + o.triggeredInteractions.filter((i: any) => i.type === "conflict").length, 0);
      track("commons_debrief", {
        overall_grade: overallGrade,
        archetype,
        total_synergies: totalSynergies,
        total_conflicts: totalConflicts,
        scenarios_played: outcomes.length,
      });
    }
  }, [phase]);

  const crisis = crises[crisisIdx];
  const tc = useTranslatedCrisis(crisis);
  const role = ROLES[roleIdx];
  const crisisDecisions = decisions[crisis?.id] || {};

  // IDs of scenarios that have been completed
  const completedIds = new Set(outcomes.map((o: any) => o.crisisId));

  const startQueue = (ids: string[]) => {
    if (ids.length === 0) return;
    setQueue(ids);
    const firstId = ids[0];
    const idx = crises.findIndex((c: any) => c.id === firstId);
    if (idx === -1) return;
    const startCrisis = crises[idx];
    track("commons_scenario_start", {
      scenario_id: startCrisis.id,
      scenario_title: startCrisis.title,
    });
    setCrisisIdx(idx);
    setRoleIdx(0);
    setSelectedOption(null);
    setShowAllIntel(false);
    setShowCounterfactuals(false);
    setPhase("briefing");
  };

  const commitDecision = () => {
    if (!selectedOption) return;
    const opts: any[] = crisis.options[role.id] || [];
    track("commons_role_commit", {
      scenario_id: crisis.id,
      role_id: role.id,
      option_id: selectedOption,
      option_label: opts.find((o: any) => o.id === selectedOption)?.label || "",
      stance: opts.find((o: any) => o.id === selectedOption)?.stance || "",
    });
    const newDec = { ...decisions, [crisis.id]: { ...crisisDecisions, [role.id]: selectedOption } };
    setDecisions(newDec);
    setSelectedOption(null);
    if (roleIdx < ROLES.length - 1) {
      setRoleIdx(roleIdx + 1);
    } else {
      const outcome = computeOutcome(crisis, newDec[crisis.id]);
      track("commons_resolution", {
        scenario_id: crisis.id,
        grade: outcome.coordinationGrade,
        synergies: outcome.triggeredInteractions.filter((i: any) => i.type === "synergy").length,
        conflicts: outcome.triggeredInteractions.filter((i: any) => i.type === "conflict").length,
        integrity: outcome.scores.integrity,
        trust: outcome.scores.trust,
        legitimacy: outcome.scores.legitimacy,
        rights: outcome.scores.rights,
      });
      setOutcomes((prev: any[]) => {
        const existing = prev.findIndex((o: any) => o.crisisId === crisis.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { crisisId: crisis.id, ...outcome };
          return updated;
        }
        return [...prev, { crisisId: crisis.id, ...outcome }];
      });
      setPhase("resolution");
    }
  };

  const nextCrisis = () => {
    // Find current position in queue and advance
    const currentPos = queue.indexOf(crisis.id);
    const nextId = currentPos >= 0 && currentPos < queue.length - 1 ? queue[currentPos + 1] : null;
    if (nextId) {
      const idx = crises.findIndex((c: any) => c.id === nextId);
      if (idx >= 0) {
        setCrisisIdx(idx);
        setRoleIdx(0); setSelectedOption(null); setShowAllIntel(false); setShowCounterfactuals(false);
        setPhase("briefing");
        return;
      }
    }
    // Queue exhausted — return to select
    setRoleIdx(0); setSelectedOption(null); setShowAllIntel(false); setShowCounterfactuals(false);
    setPhase("select");
  };

  const restart = () => {
    setPhase("intro"); setCrisisIdx(0); setRoleIdx(0); setDecisions({}); setSelectedOption(null);
    setOutcomes([]); setShowAllIntel(false); setShowCounterfactuals(false); setShowScoring(false);
    setSelectedIds(new Set()); setQueue([]);
    setCopied(false); setFeedbackSubmitted(false); setFeedbackThinking(null); setFeedbackUseCase(null); setFeedbackEmail(""); setFeedbackSubmitting(false);
  };

  const handleGenerate = async () => {
    if (!genContext.trim()) return;
    setGenLoading(true); setGenError(null); setGenPreview(null);
    const scenario = await generateScenario(genContext);
    setGenLoading(false);
    if (scenario && scenario.title && scenario.options) {
      setGenPreview(scenario);
    } else {
      setGenError("Generation failed — try rephrasing your scenario description or try again.");
    }
  };

  const addGeneratedScenario = () => {
    if (!genPreview) return;
    setCrises((prev: any[]) => [...prev, genPreview]);
    setGenPreview(null); setGenContext(""); setGenError(null);
  };

  const toggleSelectId = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&family=Instrument+Serif&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
.fade-up { animation: fadeUp 0.5s ease forwards; }
.slide-in { animation: slideIn 0.4s ease forwards; }
.option-btn { transition: all 0.2s ease; }
.option-btn:hover { transform: translateY(-1px); }
textarea, input { font-family: 'DM Sans', sans-serif; }
@media (max-width: 767px) {
  .roleplay-layout { grid-template-columns: 1fr !important; }
  .role-sidebar { display: grid !important; grid-template-columns: 1fr 1fr; gap: 8px; }
}`;

  const S = { fontFamily: "'DM Sans', sans-serif", background: "#0c0f14", color: "#e2e8f0", minHeight: "100vh", padding: "24px" };
  const hdr = (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: "1px solid #1e2533", paddingBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #1e2533", borderRadius: 6, color: "#64748b", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 1, padding: "6px 12px", flexShrink: 0 }}>
          ← {t("nav.backToHome")}
        </button>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#06b6d4", marginBottom: 4 }}>{t("govGame.multiplayerPrototype")}</div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, fontWeight: 400 }}>{t("govGame.title")}</h1>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#64748b", marginTop: 4 }}>{t("govGame.subtitle")}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {phase !== "intro" && phase !== "select" && phase !== "debrief" && queue.length > 0 && (
          <div style={{ textAlign: "right" as const }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#64748b" }}>{t("govGame.crisis")}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700 }}>{queue.indexOf(crisis?.id) + 1} / {queue.length}</div>
          </div>
        )}
        <LanguageToggle />
      </div>
    </div>
  );

  // ─── INTRO ───────────────────────────────
  if (phase === "intro") {
    return (
      <div style={S}><style>{css}</style>{hdr}
        <div style={{ maxWidth: 720, margin: "0 auto", paddingTop: 16 }}>
          <div className="fade-up" style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌐</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, marginBottom: 16 }}>{t("govGame.coordinationProblem")}</h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: 15, marginBottom: 20 }}>AI governance isn't about any single institution — it's about whether multiple actors with asymmetric information (each actor knows things the others don't), different incentives, and different time horizons can act coherently under pressure.</p>
            <div style={{ background: "#1e293b", borderRadius: 8, padding: 16, marginBottom: 20 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 1.5, color: "#06b6d4", marginBottom: 10 }}>{t("govGame.howItWorks")}</div>
              <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: 14 }}>A crisis unfolds. You step into four institutional roles — each with <strong style={{ color: "#e2e8f0" }}>private intelligence</strong> the others can't see. Commit each role's decision blind, then discover how your choices <strong style={{ color: "#e2e8f0" }}>interact</strong>.</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <button onClick={() => setShowScoring(!showScoring)} style={{ width: "100%", padding: "10px 14px", background: "#0c0f14", border: "1px solid #1e2533", borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 1.5, color: "#f59e0b" }}>📊 HOW SCORING WORKS</span>
                <span style={{ color: "#64748b", fontSize: 12 }}>{showScoring ? "▾" : "▸"}</span>
              </button>
              {showScoring && (
                <div style={{ background: "#0c0f14", border: "1px solid #1e2533", borderTop: "none", borderRadius: "0 0 8px 8px", padding: 16 }}>
                  <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>Your outcome is measured on four metrics. Each role's individual choice affects all four — but the <strong style={{ color: "#e2e8f0" }}>interactions between roles</strong> generate the largest swings. A single synergy (two actions that amplified each other's positive effects) or conflict (two actions that undermined each other, making things worse) can outweigh any individual decision. Your coordination grade (measures how well institutional actions reinforced or undermined each other) is determined by the balance of these interactions.</p>
                  {METRICS_INFO.map(m => (
                    <div key={m.key} style={{ display: "flex", gap: 10, marginBottom: 10, padding: 10, background: "#141820", borderRadius: 6, border: `1px solid ${m.color}22` }}>
                      <span style={{ fontSize: 18 }}>{m.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: m.color, letterSpacing: 1 }}>{m.label.toUpperCase()}</div>
                        <p style={{ color: "#94a3b8", fontSize: 11, lineHeight: 1.5, marginTop: 3 }}>{m.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{ background: "#f59e0b11", border: "1px solid #f59e0b33", borderRadius: 6, padding: 10, marginTop: 8 }}>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#f59e0b", lineHeight: 1.5 }}>⚡ KEY: Each option shows its trade-off signature (e.g. "INTEGRITY ↑ TRUST ↓"). The coordination grade is based on how many synergies vs conflicts your combined choices trigger.</p>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {ROLES.map(r => (
                <div key={r.id} style={{ background: r.bg, borderRadius: 8, padding: 14, border: `1px solid ${r.color}22` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{r.icon}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: r.color, letterSpacing: 1 }}>{r.name}</span>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748b", letterSpacing: 1, marginBottom: 3 }}>{t("govGame.yourRole")}</div>
                    <div style={{ fontSize: 11, color: "#e2e8f0", lineHeight: 1.4 }}>{r.role}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#f59e0b", letterSpacing: 1, marginBottom: 3 }}>{t("govGame.yourIncentives")}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4 }}>{r.incentive}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setPhase("select")} style={{ width: "100%", padding: "14px 24px", background: "linear-gradient(135deg, #06b6d4, #0ea5e9)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              {t("govGame.scenarioSelection")} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── SELECT ────────────────────────────────
  if (phase === "select") {
    const coreCrises = crises.slice(0, BUILT_IN_CRISES.length);
    const workshopCrises = crises.slice(BUILT_IN_CRISES.length, BUILT_IN_CRISES.length + WORKSHOP_SCENARIOS.length);
    const aiCrises = crises.slice(BUILT_IN_CRISES.length + WORKSHOP_SCENARIOS.length);
    const workshopIds = workshopCrises.map((c: any) => c.id);
    const anyCompleted = completedIds.size > 0;

    const ScenarioCard = ({ c, typeLabel, typeColor }: { c: any; typeLabel: string; typeColor: string }) => {
      const tcCard = useTranslatedCrisis(c);
      const isSelected = selectedIds.has(c.id);
      const isCompleted = completedIds.has(c.id);
      const outcome = outcomes.find((o: any) => o.crisisId === c.id);
      const gc: Record<string, string> = { A: "#10b981", "A-": "#10b981", B: "#06b6d4", "B-": "#06b6d4", C: "#f59e0b", "C-": "#f59e0b", D: "#f97316", "D-": "#f97316", F: "#ef4444" };
      const gradeCol = outcome ? (gc[outcome.coordinationGrade] || "#64748b") : null;
      return (
        <div onClick={() => toggleSelectId(c.id)} style={{ position: "relative", background: "#141820", border: `2px solid ${isSelected ? "#06b6d4" : "#1e2533"}`, borderRadius: 10, padding: 16, cursor: "pointer", transition: "all 0.18s ease", transform: isSelected ? "translateY(-2px)" : "none", boxShadow: isSelected ? "0 6px 24px rgba(6,182,212,0.15)" : "none" }}>
          {isCompleted && outcome && (
            <div style={{ position: "absolute", top: 10, right: 10, fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: gradeCol!, background: `${gradeCol}18`, border: `1px solid ${gradeCol}44`, borderRadius: 6, padding: "2px 8px" }}>{outcome.coordinationGrade}</div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 26 }}>{c.icon}</span>
            <div style={{ flex: 1, paddingRight: isCompleted ? 44 : 0 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.2 }}>{tcCard.title}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748b", marginTop: 2 }}>{c.category}</div>
            </div>
          </div>
          {c.stakes && <p style={{ color: "#64748b", fontSize: 11, lineHeight: 1.5, marginBottom: 8 }}>{tcCard.stakes}</p>}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: typeColor, background: `${typeColor}18`, padding: "2px 8px", borderRadius: 4 }}>{typeLabel}</span>
            {isCompleted && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#10b981" }}>PLAYED</span>}
          </div>
        </div>
      );
    };

    return (
      <div style={S}><style>{css}</style>{hdr}
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="fade-up" style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#64748b", marginBottom: 4 }}>{t("govGame.scenarioSelection")}</div>
                <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, fontWeight: 400 }}>Choose your scenarios</h2>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, justifyContent: "flex-end" }}>
                {anyCompleted && (
                  <button onClick={() => setPhase("debrief")} style={{ padding: "10px 18px", background: "#141820", color: "#10b981", border: "1px solid #10b98144", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>
                    View Debrief ({completedIds.size} played) →
                  </button>
                )}
                <button onClick={() => startQueue(crises.map((c: any) => c.id))} style={{ padding: "10px 18px", background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 1 }}>
                  {t("govGame.playAll")} ({crises.length})
                </button>
                <button onClick={() => { if (selectedIds.size > 0) startQueue([...selectedIds]); }} disabled={selectedIds.size === 0} style={{ padding: "10px 18px", background: selectedIds.size > 0 ? "linear-gradient(135deg, #06b6d4, #0ea5e9)" : "#1e293b", color: selectedIds.size > 0 ? "#fff" : "#334155", border: "none", borderRadius: 8, cursor: selectedIds.size > 0 ? "pointer" : "not-allowed", fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>
                  {t("govGame.playSelected")} ({selectedIds.size}) →
                </button>
              </div>
            </div>

            {/* CORE SCENARIOS */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#64748b", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                {t("govGame.coreScenarios")}
                <span style={{ background: "#1e293b", borderRadius: 4, padding: "2px 6px", fontSize: 9 }}>{coreCrises.length}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {coreCrises.map((c: any) => <ScenarioCard key={c.id} c={c} typeLabel={t("govGame.builtIn")} typeColor="#64748b" />)}
              </div>
            </div>

            {/* WORKSHOP LIFECYCLE */}
            {workshopCrises.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#06b6d4", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  {t("govGame.workshopLifecycle")}
                  <span style={{ background: "#06b6d418", borderRadius: 4, padding: "2px 6px", fontSize: 9 }}>{workshopCrises.length}</span>
                  <button onClick={() => startQueue(workshopIds)} style={{ marginLeft: "auto", padding: "4px 12px", background: "#06b6d418", color: "#06b6d4", border: "1px solid #06b6d433", borderRadius: 6, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>
                    {t("govGame.playLifecycleArc")} →
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {workshopCrises.map((c: any) => <ScenarioCard key={c.id} c={c} typeLabel={t("govGame.workshop")} typeColor="#06b6d4" />)}
                </div>
              </div>
            )}

            {/* AI-GENERATED */}
            {aiCrises.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#a855f7", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  {t("govGame.aiGenerated")}
                  <span style={{ background: "#a855f718", borderRadius: 4, padding: "2px 6px", fontSize: 9 }}>{aiCrises.length}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {aiCrises.map((c: any) => <ScenarioCard key={c.id} c={c} typeLabel={t("govGame.aiGenerated")} typeColor="#a855f7" />)}
                </div>
              </div>
            )}

            {/* AI SCENARIO GENERATOR — hidden until functional */}
          </div>
        </div>
      </div>
    );
  }

  // ─── BRIEFING ──────────────────────────────
  if (phase === "briefing") {
    return (
      <div style={S}><style>{css}</style>{hdr}
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="fade-up" style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 36 }}>{crisis.icon}</span>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#ef4444" }}>{crisis.category}</div>
                <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, fontWeight: 400 }}>{tc.title}</h2>
              </div>
            </div>
            <div style={{ background: "#1e293b", borderRadius: 8, padding: 16, marginBottom: 16, borderLeft: "3px solid #ef4444" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#ef4444", letterSpacing: 1, marginBottom: 8 }}>📡 PUBLIC BRIEFING — ALL ACTORS</div>
              <p style={{ color: "#e2e8f0", lineHeight: 1.7, fontSize: 14 }}>{tc.publicBriefing}</p>
            </div>
            <div style={{ background: "#0c0f14", borderRadius: 8, padding: 14, marginBottom: 16, border: "1px solid #f59e0b33" }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: "#f59e0b", marginBottom: 4 }}>{t("govGame.whatsAtStake")}</div>
              <p style={{ fontSize: 13, color: "#f59e0b", lineHeight: 1.5 }}>{tc.stakes}</p>
            </div>
            {crisis.designNote && (
              <div style={{ background: "#0c0f14", borderRadius: 8, padding: 14, marginBottom: 16, border: "1px solid #a855f733" }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: "#a855f7", marginBottom: 4 }}>🎯 {t("govGame.designNote")}</div>
                <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{tc.designNote}</p>
              </div>
            )}
            <div style={{ background: "#06b6d411", borderRadius: 8, padding: 12, marginBottom: 20, border: "1px solid #06b6d433" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#06b6d4", lineHeight: 1.5 }}>📊 SCORING: Each option shows its trade-off (e.g. "INTEGRITY ↑ TRUST ↓"). Your individual choices matter, but <strong>interactions between roles</strong> generate the biggest score swings — for better or worse.</div>
            </div>
            <button onClick={() => { setRoleIdx(0); setPhase("roleplay"); }} style={{ width: "100%", padding: "14px", background: ROLES[0].color, color: "#0c0f14", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              {t("govGame.beginAs")} {ROLES[0].name} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── ROLEPLAY ──────────────────────────────
  if (phase === "roleplay") {
    const intel = crisis.roleIntel[role.id];
    const opts = tc?.options?.[role.id] || crisis.options[role.id];
    return (
      <div style={S}><style>{css}</style>{hdr}
        <div className="roleplay-layout" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, maxWidth: 960, margin: "0 auto" }}>
          <div className="role-sidebar" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ROLES.map((r, i) => <RoleCard key={r.id} role={r} isActive={i === roleIdx} isCompleted={!!crisisDecisions[r.id]} />)}
          </div>
          <div className={animIn ? "slide-in" : ""} style={{ opacity: animIn ? 1 : 0 }}>
            <div style={{ background: role.bg, border: `1px solid ${role.color}33`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 32, flexShrink: 0 }}>{role.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color: role.color, letterSpacing: 1, marginBottom: 8 }}>{role.name.toUpperCase()}</div>
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748b", letterSpacing: 1, marginBottom: 3 }}>{t("govGame.yourRole")}</div>
                    <div style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.4 }}>{t(roles.${role.id}.role, role.role)}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#f59e0b", letterSpacing: 1, marginBottom: 3 }}>{t("govGame.yourIncentives")}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>{role.incentive}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: role.color, marginBottom: 4 }}>🔒 {t("govGame.privateIntel")}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748b", marginBottom: 12 }}>{tc?.roleIntel?.[role.id]?.classification ?? intel.classification}</div>
              {intel.bullets.map((b: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: i < intel.bullets.length - 1 ? "1px solid #1e2533" : "none" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: role.color, flexShrink: 0, marginTop: 2 }}>▸</span>
                  <p style={{ color: "#e2e8f0", lineHeight: 1.6, fontSize: 13 }}>{tc?.roleIntel?.[role.id]?.bullets?.[i] ?? b}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 20 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#64748b", marginBottom: 12 }}>{t("govGame.yourResponse")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {opts.map((opt: any) => (
                  <button key={opt.id} className="option-btn" onClick={() => setSelectedOption(opt.id)} style={{ background: selectedOption === opt.id ? role.bg : "#0c0f14", border: `2px solid ${selectedOption === opt.id ? role.color : "#1e2533"}`, borderRadius: 10, padding: 16, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color: selectedOption === opt.id ? role.color : "#e2e8f0", marginBottom: 4 }}>{opt.label}</div>
                    <p style={{ color: "#94a3b8", lineHeight: 1.5, fontSize: 12, marginBottom: 8 }}>{opt.detail}</p>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#94a3b8", lineHeight: 1.4, padding: "6px 10px", background: "#1e293b", borderRadius: 4, borderLeft: "2px solid #334155" }}>
                      <span style={{ color: "#64748b", letterSpacing: 1, fontSize: 9 }}>{t("govGame.tension")}: </span>
                      {opt.tension || opt.detail}
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={commitDecision} disabled={!selectedOption} style={{ width: "100%", padding: "14px", background: selectedOption ? role.color : "#1e293b", color: selectedOption ? "#0c0f14" : "#64748b", border: "none", borderRadius: 8, cursor: selectedOption ? "pointer" : "not-allowed", fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", opacity: selectedOption ? 1 : 0.5 }}>
                {roleIdx < ROLES.length - 1 ? `${t("govGame.lockIn")} → ${ROLES[roleIdx + 1].name}` : `${t("govGame.lockIn")} → ${t("govGame.seeOutcome")}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── RESOLUTION ────────────────────────────
  if (phase === "resolution") {
    const outcome = outcomes[outcomes.length - 1];
    const counterfactuals = computeCounterfactuals(crisis, decisions[crisis.id], outcome);
    const gradeColor: any = { A: "#10b981", "A-": "#10b981", B: "#06b6d4", "B-": "#06b6d4", C: "#f59e0b", "C-": "#f59e0b", D: "#f97316", "D-": "#f97316", F: "#ef4444" }[outcome.coordinationGrade] || "#64748b";

    return (
      <div style={S}><style>{css}</style>{hdr}
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="fade-up" style={{ background: "#141820", border: `1px solid ${gradeColor}33`, borderRadius: 12, padding: 28, marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#64748b", marginBottom: 8 }}>{t("govGame.coordinationGrade")}</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 72, fontWeight: 400, lineHeight: 1, color: gradeColor }}>{outcome.coordinationGrade}</div>
            <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 8 }}>{outcome.coordinationDesc}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {ROLES.map(r => {
              const opt = outcome.chosenOptions[r.id];
              return (
                <div key={r.id} style={{ background: "#141820", border: `1px solid ${r.color}22`, borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{r.icon}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: r.color, letterSpacing: 1 }}>{r.name}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{opt ? (tc?.options?.[r.id]?.find((o: any) => o.id === opt.id)?.label ?? opt.label) : null}</div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1, padding: "2px 6px", borderRadius: 3, marginTop: 4, display: "inline-block", background: opt?.stance === "transparent" ? "#10b98122" : opt?.stance === "restrictive" ? "#ef444422" : "#f59e0b22", color: opt?.stance === "transparent" ? "#10b981" : opt?.stance === "restrictive" ? "#ef4444" : "#f59e0b" }}>
                    {opt?.stance ? t(`stances.${opt.stance}`) : null}
                  </span>
                </div>
              );
            })}
          </div>

          {outcome.triggeredInteractions.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#64748b", marginBottom: 10 }}>{t("govGame.institutionalInteractions")}</div>
              {outcome.triggeredInteractions.map((inter: any, i: number) => (
                <div key={i} className="fade-up" style={{ background: "#141820", border: `1px solid ${inter.type === "synergy" ? "#10b981" : "#ef4444"}33`, borderRadius: 10, padding: 16, marginBottom: 10, borderLeft: `3px solid ${inter.type === "synergy" ? "#10b981" : "#ef4444"}`, animationDelay: `${i * 0.15}s` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 14 }}>{inter.type === "synergy" ? "🤝" : "💥"}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: inter.type === "synergy" ? "#10b981" : "#ef4444" }}>{inter.type === "synergy" ? t("govGame.synergy") : t("govGame.conflict")}: {tc?.interactions?.[inter._idx]?.label ?? inter.label}</span>
                  </div>
                  <p style={{ color: "#94a3b8", lineHeight: 1.6, fontSize: 13 }}>{tc?.interactions?.[inter._idx]?.desc ?? inter.desc}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#64748b", marginBottom: 12 }}>{t("govGame.collectiveImpact")}</div>
            {METRICS_INFO.map(m => <MetricBar key={m.key} label={t(`metrics.${m.key}`)} value={outcome.scores[m.key]} icon={m.icon} color={m.color} />)}
          </div>

          <div style={{ marginBottom: 16 }}>
            <button onClick={() => setShowCounterfactuals(!showCounterfactuals)} style={{ width: "100%", padding: "12px", background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 1 }}>
              {showCounterfactuals ? "▾ HIDE" : "▸ SHOW"} {t("govGame.whatCouldBeBetter")}
            </button>
            {showCounterfactuals && (
              <div style={{ marginTop: 10 }}>
                {counterfactuals.map((cf: any, i: number) => (
                  <div key={i} style={{ background: "#141820", border: `1px solid ${cf.roleColor}33`, borderRadius: 10, padding: 14, marginBottom: 8, borderLeft: `3px solid ${cf.roleColor}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 14 }}>{cf.roleIcon}</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: cf.roleColor }}>{cf.roleName}</span>
                    </div>
                    <p style={{ color: "#e2e8f0", fontSize: 13, marginBottom: 4 }}>
                      If they had chosen <strong style={{ color: cf.roleColor }}>{tc?.options?.[cf.roleId]?.find((o: any) => o.id === cf.toOptId)?.label ?? cf.toLabel}</strong> instead of <span style={{ color: "#64748b" }}>{tc?.options?.[cf.roleId]?.find((o: any) => o.id === cf.fromOptId)?.label ?? cf.fromLabel}</span>:
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: "#10b981" }}>
                        +{cf.diff} overall
                      </span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#64748b" }}>
                        Grade: {outcome.coordinationGrade} → {cf.newGrade}
                      </span>
                    </div>
                  </div>
                ))}
                {counterfactuals.length === 0 && (
                  <div style={{ marginTop: 10, padding: 14, background: "#141820", border: "1px solid #10b98133", borderRadius: 10, borderLeft: "3px solid #10b981" }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#10b981" }}>✓ {t("govGame.noImprovement")}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <button onClick={() => setShowAllIntel(!showAllIntel)} style={{ width: "100%", padding: "12px", background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 1 }}>
              {showAllIntel ? `▾ ${t("govGame.hideIntel")}` : `▸ ${t("govGame.revealIntel")}`}
            </button>
            {showAllIntel && (
              <div style={{ marginTop: 10 }}>
                {ROLES.map(r => (
                  <div key={r.id} style={{ background: "#141820", border: `1px solid ${r.color}22`, borderRadius: 10, padding: 14, marginBottom: 8 }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: r.color, letterSpacing: 1, marginBottom: 8 }}>{r.icon} {r.name.toUpperCase()}</div>
                    {crisis.roleIntel[r.id].bullets.map((b: string, i: number) => (
                      <p key={i} style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.5, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${r.color}33` }}>{tc?.roleIntel?.[r.id]?.bullets?.[i] ?? b}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {queue.indexOf(crisis.id) < queue.length - 1 && (
              <button onClick={nextCrisis} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #06b6d4, #0ea5e9)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const }}>
                Next in Queue →
              </button>
            )}
            <button onClick={() => setPhase("select")} style={{ flex: 1, padding: "14px", background: "#141820", color: "#e2e8f0", border: "1px solid #1e2533", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const }}>
              ← {t("govGame.backToScenarios")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── DEBRIEF ───────────────────────────────
  if (phase === "debrief") {
    // Only average/display scenarios that were actually played
    const playedOutcomes = outcomes;
    const totalScores: any = { integrity: 0, trust: 0, legitimacy: 0, rights: 0 };
    playedOutcomes.forEach((o: any) => { for (const k of Object.keys(totalScores)) totalScores[k] += o.scores[k]; });
    const grades = playedOutcomes.map((o: any) => o.coordinationGrade);
    const gradeToVal: Record<string, number> = { A: 4, "A-": 3.5, B: 3, "B-": 2.5, C: 2, "C-": 1.5, D: 1, "D-": 0.5, F: 0 };
    const avgGradeVal = grades.length > 0 ? grades.reduce((s: number, g: string) => s + (gradeToVal[g] ?? 2), 0) / grades.length : 2;
    const overallGrade = avgGradeVal >= 3.75 ? "A" : avgGradeVal >= 3.25 ? "A-" : avgGradeVal >= 2.75 ? "B" : avgGradeVal >= 2.25 ? "B-" : avgGradeVal >= 1.75 ? "C" : avgGradeVal >= 1.25 ? "C-" : avgGradeVal >= 0.75 ? "D" : avgGradeVal >= 0.25 ? "D-" : "F";
    const gradeColor: any = { A: "#10b981", "A-": "#10b981", B: "#06b6d4", "B-": "#06b6d4", C: "#f59e0b", "C-": "#f59e0b", D: "#f97316", "D-": "#f97316", F: "#ef4444" }[overallGrade] || "#64748b";

    let archetype, archetypeDesc;
    if (overallGrade === "A") { archetype = "The Aligned Ecosystem"; archetypeDesc = "Your institutions found ways to reinforce each other. This is the aspiration of multi-stakeholder governance — achieved in practice by very few systems. The key factor wasn't any single actor's wisdom, but the communication architecture between them."; }
    else if (overallGrade === "B") { archetype = "The Imperfect Coalition"; archetypeDesc = "More synergies than conflicts, but gaps remain. This mirrors most successful real-world governance — functional but fragile, with success depending on informal relationships rather than structural design."; }
    else if (overallGrade === "C") { archetype = "The Fog of Governance"; archetypeDesc = "Actions occurred in parallel but didn't compose. Each institution did something reasonable in isolation, but the collective effect was incoherent. This is the default state of AI governance today."; }
    else { archetype = "The Institutional Fragmentation"; archetypeDesc = "Your institutions actively undermined each other. Actions that made sense from one perspective created cascading problems from another — precisely the failure mode that asymmetric information produces under time pressure."; }

    const totalSynergies = outcomes.reduce((s: number, o: any) => s + o.triggeredInteractions.filter((i: any) => i.type === "synergy").length, 0);
    const totalConflicts = outcomes.reduce((s: number, o: any) => s + o.triggeredInteractions.filter((i: any) => i.type === "conflict").length, 0);

    return (
      <div style={S}><style>{css}</style>{hdr}
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div className="fade-up" style={{ background: "#141820", border: `1px solid ${gradeColor}33`, borderRadius: 12, padding: 32, marginBottom: 20 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, color: gradeColor, marginBottom: 8 }}>
              {t("govGame.simulationOutcome")} — {grades.length} {t("govGame.of")} {crises.length} {t("govGame.scenariosPlayed")}
            </div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, fontWeight: 400, color: gradeColor, marginBottom: 12 }}>{archetype}</h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: 14 }}>{archetypeDesc}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, color: gradeColor }}>{overallGrade}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#64748b" }}>{t("govGame.overallGrade")}</div>
            </div>
            <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 32, color: "#10b981" }}>{totalSynergies}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#64748b" }}>{t("govGame.synergies")}</div>
            </div>
            <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 32, color: "#ef4444" }}>{totalConflicts}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#64748b" }}>{t("govGame.conflicts")}</div>
            </div>
          </div>

          <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#64748b", marginBottom: 12 }}>{t("govGame.cumulativeImpact")}</div>
            {METRICS_INFO.map(m => <MetricBar key={m.key} label={t(`metrics.${m.key}`)} value={totalScores[m.key]} icon={m.icon} color={m.color} />)}
          </div>

          {crises.map((c: any) => {
            const o = outcomes.find((out: any) => out.crisisId === c.id);
            const gcMap: Record<string, string> = { A: "#10b981", "A-": "#10b981", B: "#06b6d4", "B-": "#06b6d4", C: "#f59e0b", "C-": "#f59e0b", D: "#f97316", "D-": "#f97316", F: "#ef4444" };
            const gc = o ? (gcMap[o.coordinationGrade] || "#64748b") : null;
            return (
              <div key={c.id} style={{ background: "#141820", border: `1px solid ${o ? "#1e2533" : "#0f1520"}`, borderRadius: 10, padding: 16, marginBottom: 10, opacity: o ? 1 : 0.45 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: o ? 8 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{c.icon}</span>
                    <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 16 }}>{t(`scenarios.${c.id}.title`, c.title)}</span>
                  </div>
                  {o ? (
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700, color: gc! }}>{o.coordinationGrade}</span>
                  ) : (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#334155", background: "#1e293b", padding: "3px 8px", borderRadius: 4 }}>{t("govGame.notPlayed")}</span>
                  )}
                </div>
                {o && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {o.triggeredInteractions.map((inter: any, i: number) => (
                      <span key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, padding: "3px 8px", borderRadius: 4, background: inter.type === "synergy" ? "#10b98122" : "#ef444422", color: inter.type === "synergy" ? "#10b981" : "#ef4444" }}>
                        {inter.type === "synergy" ? "🤝" : "💥"} {t(`scenarios.${c.id}.interactions.${inter._idx}.label`, inter.label)}
                      </span>
                    ))}
                    {o.triggeredInteractions.length === 0 && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748b" }}>No interactions — isolated action</span>}
                  </div>
                )}
              </div>
            );
          })}

          <div className="fade-up" style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 24, marginTop: 20, marginBottom: 20 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#06b6d4", marginBottom: 10 }}>THE CORE INSIGHT</div>
            <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: 14 }}>
              The hardest problem in AI governance isn't making good individual decisions — it's making decisions that <em style={{ color: "#e2e8f0" }}>compose well</em> across institutions with asymmetric information and conflicting incentives. Coordination architecture — the channels through which institutions share information and align action — determines whether individual good decisions produce collective good outcomes.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 10, padding: 16 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: "#a855f7", marginBottom: 8 }}>FOR FACILITATORS</div>
              <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6 }}>Assign each participant a role and physically separate them. Give 3 minutes to read intel and decide. Bring everyone together for the reveal. The "what if" analysis makes the debrief conversation concrete.</p>
            </div>
            <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 10, padding: 16 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: "#06b6d4", marginBottom: 8 }}>MULTIPLAYER ROADMAP</div>
              <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6 }}>Full version: separate devices, real-time decision locking, a negotiation phase for limited info-sharing before commitment, and AI-generated scenarios tailored to your workshop context.</p>
            </div>
          </div>

          {/* ─── SHAREABLE RESULTS CARD ─── */}
          {(() => {
            const resultText = [
              `🌐 THE AI GOVERNANCE GAME — AI Governance Simulation`,
              ``,
              `My Result: ${archetype}`,
              `Coordination Grade: ${overallGrade}`,
              `Synergies: ${totalSynergies} | Conflicts: ${totalConflicts}`,
              ``,
              `Metrics:`,
              `  🎯 Information Integrity: ${totalScores.integrity > 0 ? '+' : ''}${totalScores.integrity}`,
              `  👥 Public Trust: ${totalScores.trust > 0 ? '+' : ''}${totalScores.trust}`,
              `  ⚖️ Institutional Legitimacy: ${totalScores.legitimacy > 0 ? '+' : ''}${totalScores.legitimacy}`,
              `  🛡️ Individual Rights: ${totalScores.rights > 0 ? '+' : ''}${totalScores.rights}`,
              ``,
              `The hardest problem in AI governance isn't individual decisions — it's coordination.`,
              ``,
              `Try it: strategy.mobilis.studio`
            ].join('\n');
            const copyResult = () => {
              track("commons_share", { archetype, grade: overallGrade });
              navigator.clipboard.writeText(resultText).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              });
            };
            const submitFeedback = async () => {
              track("feedback_submitted", {
                tool: "commons",
                changed_thinking: feedbackThinking || "",
                use_case: feedbackUseCase || "",
                has_email: feedbackEmail ? "yes" : "no",
              });
              setFeedbackSubmitting(true);
              try {
                const formData = new URLSearchParams();
                formData.append("form-name", "simulation-feedback");
                formData.append("tool", "epistemic-commons");
                formData.append("archetype", archetype);
                formData.append("grade", overallGrade);
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
              <>
                <div style={{ background: "#141820", border: "1px solid #1e2533", borderRadius: 12, padding: 24, marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#06b6d4", marginBottom: 12 }}>{t("share.shareResult")}</div>
                  <div style={{ background: "#0c0f14", border: `1px solid ${gradeColor}33`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748b", letterSpacing: 1 }}>MY INSTITUTIONAL ARCHETYPE</div>
                        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: gradeColor, marginTop: 4 }}>{archetype}</div>
                      </div>
                      <div style={{ textAlign: "right" as const }}>
                        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: gradeColor, lineHeight: 1 }}>{overallGrade}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748b" }}>GRADE</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                      <div><span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: "#10b981", fontWeight: 700 }}>{totalSynergies}</span><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748b", marginLeft: 4 }}>synergies</span></div>
                      <div><span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: "#ef4444", fontWeight: 700 }}>{totalConflicts}</span><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748b", marginLeft: 4 }}>conflicts</span></div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        { label: "Integrity", val: totalScores.integrity, icon: "🎯" },
                        { label: "Trust", val: totalScores.trust, icon: "👥" },
                        { label: "Legitimacy", val: totalScores.legitimacy, icon: "⚖️" },
                        { label: "Rights", val: totalScores.rights, icon: "🛡️" }
                      ].map((m, i) => (
                        <div key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: m.val > 0 ? "#10b981" : m.val < 0 ? "#ef4444" : "#64748b" }}>
                          {m.icon} {m.label}: {m.val > 0 ? "+" : ""}{m.val}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1e2533", fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748b" }}>
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
                    <input type="hidden" name="tool" value="epistemic-commons" />
                    <input type="hidden" name="archetype" value={archetype} />
                    <input type="hidden" name="grade" value={overallGrade} />
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
                <div style={{ background: "linear-gradient(135deg, #06b6d411, #a855f711)", border: "1px solid #06b6d433", borderRadius: 12, padding: 20, marginBottom: 20, textAlign: "center" as const }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🎓</div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#e2e8f0", marginBottom: 8 }}>Run this with your team</div>
                  <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, marginBottom: 12, maxWidth: 480, margin: "0 auto 12px" }}>
                    These simulations are designed for group workshops. Assign real roles, separate your participants, and discover how your organization thinks about AI governance trade-offs.
                  </p>
                  <p style={{ color: "#64748b", fontFamily: "'DM Mono', monospace", fontSize: 10 }}>
                    Workshop formats available: 15-minute demo · 1-hour session · 2-hour lifecycle arc
                  </p>
                </div>
              </>
            );
          })()}

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setPhase("select")} style={{ flex: 1, padding: "14px 24px", background: "#141820", color: "#e2e8f0", border: "1px solid #1e2533", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const }}>
              ↩ Scenarios
            </button>
            <button onClick={restart} style={{ flex: 1, padding: "14px 24px", background: "#0c0f14", color: "#64748b", border: "1px solid #1e2533", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" as const }}>
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
  return null;
}
