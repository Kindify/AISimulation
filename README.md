# The Epistemic Commons & Institutional Stress Test

**Live at [strategy.mobilis.studio](https://strategy.mobilis.studio)**

Interactive simulation tools for exploring AI governance trade-offs. Built as an action plan project following the [Blue Dot Impact](https://www.bluedot.org/) AGI Strategy Course.

---

## Theory of Change

**IF** we build tools that honestly communicate the trade-offs of AI governance and validate their effectiveness through empirical study,

**THEN** policymakers and the public will move from "vague fear" to "accurate mental models" of epistemic and institutional risks,

**WHICH LEADS TO** increased democratic pressure for robust, evidence-based AI safeguards and faster institutional adaptation.

**ASSUMING** interactive formats actually improve decision-making (not just engagement) and that there is an appetite in mainstream institutions for balanced, non-polarized educational content.

---

## The Tools

### Tool A: The Institutional Stress Test (The Pacing Simulator)

A single-player strategy dashboard where you manage an AI regulatory body with limited "Institutional Bandwidth."

- **The Mechanic**: AI-driven challenges appear (automated lobbying, deepfake scandals, autonomous hiring discrimination, frontier capability jumps). You respond on a Speed ↔ Rigour spectrum.
- **The Trade-off**: Increasing speed risks regulatory capture and errors. Increasing rigour leads to obsolescence as technology outpaces your rules.
- **The Insight**: There is no correct answer — only trade-offs. The *how* of governance matters as much as the *whether*.

### Tool B: The Epistemic Commons (Multiplayer Coordination Game)

A multiplayer-prototype deliberation game where 4 institutional actors face AI-driven crises with asymmetric information.

- **The Roles**: Regulator, Platform, Journalist, AI Lab — each with private intelligence the others can't see.
- **The Mechanic**: Commit decisions blind, then discover how your choices *interact*. Synergies amplify good outcomes. Conflicts create cascading failures.
- **The Insight**: The hardest problem in AI governance isn't making good individual decisions — it's making decisions that *compose well* across institutions with different information, incentives, and time horizons.

**Features:**
- Visible scoring framework with 4 metrics (Information Integrity, Public Trust, Institutional Legitimacy, Individual Rights)
- Counterfactual "what if" analysis after each crisis
- AI-powered scenario generator (describe a context → get a playable scenario)
- 6 built-in scenarios forming a lifecycle arc

---

## The Scenarios

### Core Scenarios
| | Title | Domain | What It Tests |
|---|---|---|---|
| 🗳️ | The Synthetic Candidate | Electoral integrity | Coordination under extreme time pressure |
| 💊 | The Invisible Epidemic | Public health × AI safety | Precautionary action vs. evidence-based response |

### Workshop Lifecycle Arc
Designed to be played in sequence — each builds on the dynamics of the previous:

| | Title | Domain | What It Tests |
|---|---|---|---|
| 🧬 | The Crossing | Open-weight biorisk | Anticipatory governance and competitive dynamics |
| 🌀 | The Void | Decentralized governance | Institutional adaptation when assumptions are invalidated |
| 🤖 | The Jump | Agentic capability escalation | The dual-use dilemma — the dangerous capability IS the useful capability |
| 🔴 | The Day Of | Post-catastrophe governance | Accountability vs. overreaction after a mass-casualty event |

The lifecycle arc supports a retrospective exercise: after playing "The Day Of," work backwards through each prior scenario and ask — *where could intervention have changed this outcome? Was that intervention politically feasible and technically effective at the time?*

---

## Workshop Format

### Quick Demo (15 min)
Play one scenario from each tool to demonstrate the core mechanics.

### Standard Workshop (1 hour)
- **Round 1** (20 min): Institutional Stress Test — individual pacing problem
- **Round 2** (25 min): Epistemic Commons — one crisis with full debrief
- **Discussion** (15 min): Compare individual vs. collective decision-making dynamics

### Full Lifecycle (2 hours)
- **Round 1** (25 min): The Crossing — anticipatory governance
- **Round 2** (25 min): The Void — institutional adaptation
- **Round 3** (25 min): The Jump or The Day Of — escalation/accountability
- **Debrief** (30 min): Lifecycle retrospective — where was intervention possible?

### Multiplayer (In-Person)
Assign each participant a role. Physically separate them. Give 3 minutes to read private intel and decide. Bring everyone together for the reveal. The moment players see what others knew is where the learning happens.

---

## Tech Stack

- React 18 + Vite
- Inline styling (no CSS framework)
- Anthropic API for AI scenario generation
- Deployed on Netlify

---

## Running Locally

```bash
git clone https://github.com/Kindify/AISimulation.git
cd AISimulation
npm install
npm run dev
```

---

## Roadmap

- [ ] True multiplayer: separate devices, real-time decision locking
- [ ] Negotiation phase: limited information sharing before commitment
- [ ] Expanded scenario library (target: 8-10 curated scenarios)
- [ ] Empirical validation: does playing improve decision-making quality?
- [ ] Tool C ("The Lab"): Epistemic security playground at `lab.mobilis.studio`

---

## Background

This project emerged from the [Blue Dot Impact AGI Strategy Course](https://www.bluedot.org/), which examines how institutions can adapt to rapid AI capability development. The tools are designed to make abstract governance concepts — the pacing problem, regulatory capture, institutional obsolescence, epistemic security, coordination failure — tangible through interactive experience.

The core pedagogical bet: people develop better mental models of complex trade-offs by *experiencing* them than by reading about them.

---

## License

MIT

---

## Contact

Built by MJanes · github.com/kindify
