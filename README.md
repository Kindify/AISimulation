# AI Governance Simulation - The Epistemic Commons & Institutional Stress Test

**Live at [strategy.mobilis.studio](https://strategy.mobilis.studio)**

Interactive simulation tools for exploring AI governance trade-offs. Built as an action plan project following the [Blue Dot Impact](https://www.bluedot.org/) AGI Strategy Course.

---

## Theory of Change

**IF** we build tools that honestly communicate the trade-offs of AI governance and validate their effectiveness through empirical study,

**THEN** policymakers and the public will move from "vague fear" towards "accurate mental models" of epistemic and institutional risks,

**WHICH LEADS TO** increased democratic pressure for robust, evidence-based AI safeguards and faster institutional adaptation.

**ASSUMING** interactive formats actually improve decision-making (not just engagement) and that there is an appetite in mainstream institutions for balanced, non-polarized educational content.

---

## The Tools

### Tool A: The Institutional Stress Test (The Pacing Simulator)

A single-player strategy dashboard where you manage an AI regulatory body with limited "Institutional Bandwidth."

- **The Mechanic**: AI-driven challenges appear (automated lobbying, deepfake scandals, autonomous hiring discrimination, frontier capability jumps). You respond on a Speed ↔ Rigour spectrum.
- **The Trade-off**: Increasing speed risks regulatory capture and errors. Increasing rigour leads to obsolescence as technology outpaces your rules.
- **The Insight**: There is no correct answer — only trade-offs. The *how* of governance matters as much as the *whether*.

### Tool B: The Epistemic Commons (Multiplayer Coordination Simulation)

A multiplayer-prototype deliberation simulation where 4 institutional actors face AI-driven crises with asymmetric information.

- **The Roles**: Regulator, Platform, Journalist, AI Lab — each with private intelligence the others can't see.
- **The Mechanic**: Commit decisions blind, then discover how your choices *interact*. Synergies amplify good outcomes. Conflicts create cascading failures.
- **The Insight**: Some of the hardest problems in AI governance aren't just making good individual decisions — it's making decisions that *compose well* across institutions with different information, incentives, and time horizons.

**Features:**
- Four outcome metrics (Information Integrity, Public Trust, Institutional Legitimacy, Individual Rights)
- Counterfactual "what if" analysis after each crisis
- Eight built-in scenarios: two core, two news-driven, and a four-part workshop lifecycle arc
- Fully bilingual (EN/FR); every scenario ships with a French overlay that the build verifies

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
- **Round 1** (10 min): Institutional Stress Test — individual pacing problem
- **Round 2** (10 min): Epistemic Commons — one crisis with full debrief
- **Discussion** (15 min): Compare individual vs. collective decision-making dynamics

### Full Lifecycle
- **Round 1** (10 min): The Crossing — anticipatory governance
- **Round 2** (10 min): The Void — institutional adaptation
- **Round 3** (15 min): The Jump or The Day Of — escalation/accountability
- **Debrief** (15 min): Lifecycle retrospective — where was intervention possible?

### Multiplayer (In-Person)
Assign each participant a role. Physically separate them. Give 3 minutes to read private intel and decide. Bring everyone together for the reveal. The moment players see what others knew is where the learning happens.

---

## Tech Stack

- React 18 + Vite
- Inline styling (no CSS framework)
- Deployed on Netlify

---

## Running Locally

```bash
git clone https://github.com/[your-username]/AISimulation.git
cd AISimulation
npm install
npm run dev
```

---

## Roadmap


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

Copyright (c) 2026 M. Janes

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Contact

Built by [your name] · [your email or social link]

---

## Scenario Lifecycle

Scenarios live in `src/scenarios/<slug>/`. Each folder holds:

| File | Purpose |
|---|---|
| `scenario.json` | The scenario itself. English is the source of truth. |
| `fr.json` | French overlay: same shape, player-facing strings only. Required. |

There is no index to edit. Every folder with a `scenario.json` is picked up automatically at build time.

### Adding a scenario
1. Copy an existing folder (for example `export-control-precedent`) to a new slug.
2. Edit `scenario.json`: new `id`, content, and the `meta` block (below).
3. Edit `fr.json` to match. Every string in `scenario.json` needs a twin here.
4. Run `npm run validate`. Fix anything it reports. Push. Netlify runs the same validator before building, so a scenario with a missing translation or a bad interaction id cannot deploy.

### The `meta` block
```json
"meta": {
  "collection": "topical",        // core | lifecycle | topical (which section it appears in)
  "status": "featured",           // draft | featured | live | archived (see below)
  "order": 1,                     // sort position within the collection
  "sourceDate": "2026-06-28",     // reporting the scenario is based on (shown to players)
  "reviewedOn": "2026-09-03",     // last accuracy check (shown to players; validator warns past 90 days)
  "featuredUntil": "2026-10-15",  // optional: featured automatically becomes live after this date
  "supersededBy": null,           // optional: id of the scenario that replaces this one
  "sources": [{ "label": "...", "url": "https://..." }]
}
```

| Status | Listed on select screen | In Quick Play pool | Playable | Notes |
|---|---|---|---|---|
| `draft` | dev server only | no | dev only | Excluded from production builds |
| `featured` | yes, pinned first with a "This week" badge | yes, preferred | yes | Use for the current news-driven scenario |
| `live` | yes | yes | yes | Default |
| `archived` | no | no | by id only | Old links and reveal pages keep working |

Retiring a scenario is a one-line change: set `status` to `archived`. Delete the folder only when you are sure nothing links to it.

### Bilingual review mode
The EN/FR toggle appears on the home screen only. To see it on every screen while checking a translation, add `?review=1` to the URL. To share a French link, add `?lang=fr`.

### Scripts
- `npm run validate` checks every scenario (schema, interaction ids, stance coverage, French completeness, stale review dates).
- `npm run typecheck` runs TypeScript.
- `npm run build` runs both and then builds. This is what Netlify runs (see `netlify.toml`).
- `scripts/migrate-scenarios.mjs` was the one-time conversion from the old flat layout; it is kept for reference and is safe to re-run (it skips folders that already exist).
