const WORKSHOP_SCENARIOS = [
  {
    id: "the_crossing",
    title: "The Crossing",
    category: "OPEN-WEIGHT BIORISK",
    icon: "🧬",
    publicBriefing: "A leading Western AI lab is preparing to release its most capable open-weight model yet (open-weight means model weights are publicly downloadable — anyone can run or modify the model) — frontier performance competitive with their best closed model from 6 months ago. Internal evaluations have flagged something unprecedented: for the first time, the model crosses the lab's 'high risk' threshold on bioweapons knowledge tasks, showing a 3x uplift compared to the best currently available open model.",
    stakes: "The first public acknowledgment that an open-weight model crosses a biorisk threshold. The precedent set here shapes how every future frontier release is governed.",
    designNote: "This scenario tests the tension between unilateral safety action and competitive dynamics. The Chinese open model complication means there's no 'safe' option — only different distributions of risk.",
    roleIntel: {
      regulator: {
        classification: "CONFIDENTIAL — NATIONAL SECURITY ASSESSMENT",
        bullets: [
          "Your intelligence community assesses that the best Chinese open model (already downloaded 2M+ times) shows a 2.5x uplift on identical biorisk tasks — but no public eval was conducted before release, so there was no threshold-crossing moment.",
          "Your policy analysts estimate that blocking this release shifts approximately 30% of new global open-model adoption toward Chinese alternatives with higher biorisk capability and zero safety mitigations over the next 6 months.",
          "Three allied nations have privately signaled they will follow your lead on open-weight biorisk policy — but only if the framework is clear and applies equally to domestic and foreign models.",
          "Your legal authority to block a voluntary release is untested. An emergency order would likely face immediate legal challenge and could take 18+ months to resolve."
        ]
      },
      platform: {
        classification: "INTERNAL — PRODUCT & DISTRIBUTION REVIEW",
        bullets: [
          "You're the primary distribution platform for open-weight models. This model's predecessor has 4.2M downloads and powers ~12,000 production applications in healthcare, drug discovery, and agricultural biotech.",
          "Your usage analytics show that 94% of downloads go to legitimate research and commercial applications. Biorisk-adjacent queries represent <0.3% of documented usage patterns.",
          "If you refuse to host this model, at least 6 alternative platforms will host it within 48 hours. Your refusal achieves nothing except losing visibility into download patterns and usage.",
          "Your biosafety advisory board recommends hosting with enhanced monitoring — but 'enhanced monitoring' of an open-weight model after download is technically impossible."
        ]
      },
      journalist: {
        classification: "EDITORIAL — SOURCE BRIEFING",
        bullets: [
          "A whistleblower inside the lab has provided you with the internal eval results showing the 3x biorisk uplift. They want the public to know before the release decision is finalized.",
          "You've independently confirmed that the Chinese open model has comparable or higher biorisk capability — but publishing this creates a roadmap for misuse of a model most people don't know is dangerous.",
          "The lab's data curation team has a partial fix: filtering bio-related pretraining data reduces the uplift to 1.5x but degrades legitimate biology, chemistry, and medical task performance by ~15%.",
          "Your science desk editor argues that reporting the biorisk threshold honestly is essential journalism. Your national security editor argues it's irresponsible amplification."
        ]
      },
      ailab: {
        classification: "INTERNAL — SAFETY TEAM ASSESSMENT",
        bullets: [
          "Your internal evals: the model shows a 3x uplift on bioweapons knowledge tasks vs. the current best open model. Malicious fine-tuning makes this worse — your red team achieved step-by-step synthesis pathways for two controlled agents.",
          "Your data curation fix reduces the uplift to 1.5x but degrades legitimate bio/chem/medical performance by ~15%. The research community will notice and complain loudly. Some will retrain without the filter.",
          "Your competitive intelligence team reports: three other labs are 3-6 months behind on comparable open-weight releases. If you don't release, someone else will — likely without the evals or the partial fix.",
          "Your board is split. The safety faction wants to delay indefinitely. The commercial faction argues that not releasing costs $400M+ in projected ecosystem value and cedes the open-weight frontier to competitors with no safety culture."
        ]
      }
    },
    options: {
      regulator: [
        { id: "reg_block", label: "Emergency Release Hold", detail: "Issue an emergency order blocking the release pending a 90-day review and public comment period.", tradeoff: "LEGITIMACY ↑ INTEGRITY ↓ — Procedurally bold but legally untested. Adoption shifts to Chinese alternatives with higher biorisk and no safety mitigations during the hold period.", stance: "restrictive", scores: { integrity: -3, trust: 4, legitimacy: 5, rights: -6 } },
        { id: "reg_framework", label: "Conditional Release Framework", detail: "Work with the lab to establish a public threshold framework: release with the data filter applied and publish the eval methodology as an industry standard.", tradeoff: "INTEGRITY ↑ TRUST ↑ — Sets precedent for responsible disclosure. But the filtered model is weaker, and the framework may be ignored by competitors who aren't subject to your jurisdiction.", stance: "transparent", scores: { integrity: 6, trust: 5, legitimacy: 4, rights: 2 } },
        { id: "reg_defer", label: "Defer to Lab's Judgment", detail: "Issue a public statement acknowledging the lab's eval transparency without taking regulatory action, preserving future flexibility.", tradeoff: "RIGHTS ↑ INTEGRITY ↓ — Preserves the lab's autonomy and avoids a legal fight. But it signals that crossing biorisk thresholds triggers no institutional response.", stance: "cautious", scores: { integrity: -5, trust: -3, legitimacy: -2, rights: 5 } }
      ],
      platform: [
        { id: "plat_host_monitor", label: "Host with Enhanced Monitoring", detail: "Distribute the model with download logging, usage guidelines, and a rapid takedown commitment if misuse evidence emerges.", tradeoff: "RIGHTS ↑ INTEGRITY ↓ — Maintains open access and visibility. But monitoring an open-weight model after download is technically impossible — this is largely performative.", stance: "transparent", scores: { integrity: -2, trust: 2, legitimacy: 2, rights: 5 } },
        { id: "plat_refuse", label: "Refuse to Host", detail: "Decline to distribute the model, citing biorisk concerns. Issue a public statement explaining the decision.", tradeoff: "TRUST ↑ INTEGRITY ↓ — Demonstrates principled stance. But 6+ alternative platforms will host it within 48 hours — you lose visibility into download patterns while achieving nothing on distribution.", stance: "restrictive", scores: { integrity: -3, trust: 5, legitimacy: 3, rights: -4 } },
        { id: "plat_tiered", label: "Tiered Access Release", detail: "Host the filtered version publicly and gate the full version behind identity verification and institutional affiliation.", tradeoff: "BALANCED — Pragmatic compromise. But determined bad actors will bypass verification, and the research community will resent the gatekeeping.", stance: "cautious", scores: { integrity: 3, trust: 1, legitimacy: 1, rights: -2 } }
      ],
      journalist: [
        { id: "jour_full_story", label: "Publish Full Biorisk Story", detail: "Report the eval results, the Chinese model comparison, the partial fix, and the competitive dynamics — the complete picture.", tradeoff: "INTEGRITY ↑↑ RIGHTS ↑ — Maximally informative. But publishing biorisk eval details creates a targeting guide for which models to misuse and how.", stance: "transparent", scores: { integrity: 7, trust: 3, legitimacy: 2, rights: 4 } },
        { id: "jour_responsible", label: "Responsible Disclosure Story", detail: "Report that a biorisk threshold was crossed and that a mitigation exists, without publishing specific uplift numbers or comparative model performance.", tradeoff: "INTEGRITY ↑ TRUST ↑ — Informs without enabling. But the redacted version may feel incomplete, and other outlets will publish the full details within days.", stance: "cautious", scores: { integrity: 4, trust: 5, legitimacy: 4, rights: 2 } },
        { id: "jour_hold", label: "Hold the Story", detail: "Sit on the story at the lab's request until after the release decision is finalized, then publish a comprehensive post-mortem.", tradeoff: "LEGITIMACY ↓ TRUST ↓ — Gives the lab space to decide without public pressure. But you're sitting on information the public arguably needs to participate in this decision.", stance: "restrictive", scores: { integrity: -4, trust: -5, legitimacy: -3, rights: -2 } }
      ],
      ailab: [
        { id: "lab_release_filtered", label: "Release with Data Filter", detail: "Release the model with bio-related pretraining data filtered out. Publish the full eval results and the filtering methodology as an industry template.", tradeoff: "INTEGRITY ↑↑ TRUST ↑ — Sets an industry standard for responsible open-weight release. But the 15% performance hit on legitimate bio tasks hurts researchers, and the unfiltered version will be reconstructed.", stance: "transparent", scores: { integrity: 8, trust: 6, legitimacy: 5, rights: 3 } },
        { id: "lab_release_full", label: "Release Unfiltered with Evals", detail: "Release the full model but publish complete biorisk eval results, framing it as radical transparency about the risk landscape.", tradeoff: "RIGHTS ↑ TRUST ↓↓ — Maximum capability access and honesty. But you've just publicly released a model you know crosses your own biorisk threshold.", stance: "cautious", scores: { integrity: -2, trust: -7, legitimacy: -4, rights: 6 } },
        { id: "lab_delay", label: "Delay Release Indefinitely", detail: "Pause the release pending further safety research and industry coordination on biorisk thresholds.", tradeoff: "TRUST ↑ INTEGRITY ↓ — Cautious and defensible. But adoption shifts to higher-risk Chinese alternatives, and your own researchers will leak or leave.", stance: "restrictive", scores: { integrity: -4, trust: 4, legitimacy: 3, rights: -5 } }
      ]
    },
    interactions: [
      { pair: ["reg_framework", "lab_release_filtered"], type: "synergy", label: "The Responsible Release Precedent", desc: "Regulator framework + lab's filtered release + published evals created the first credible template for frontier open-weight biorisk governance. Three other labs adopted the framework within 4 months.", mod: { integrity: 8, trust: 7, legitimacy: 6 } },
      { pair: ["reg_block", "lab_delay"], type: "conflict", label: "The Vacuum", desc: "Both the regulator and lab chose caution — but the 6-month adoption shift to unmitigated Chinese alternatives was larger than projected. Global biorisk exposure increased despite both actors' good intentions.", mod: { integrity: -7, trust: -3, rights: -4 } },
      { pair: ["jour_full_story", "lab_release_full"], type: "conflict", label: "The Biorisk Playbook", desc: "The full eval numbers + unfiltered model created a de facto targeting guide. Three months later, a university biosecurity lab documented the first real-world attempt to use the published uplift pathway.", mod: { integrity: -8, trust: -6, legitimacy: -5 } },
      { pair: ["jour_responsible", "reg_framework"], type: "synergy", label: "Informed Governance", desc: "The responsible disclosure story educated the public without enabling misuse, creating political space for the regulator's framework. Public support for the threshold policy reached 67%.", mod: { integrity: 5, trust: 5, legitimacy: 4 } },
      { pair: ["plat_refuse", "lab_delay"], type: "conflict", label: "The Migration", desc: "Platform refusal + lab delay created a visibility black hole. Downloads migrated to unmonitored platforms and the Chinese alternative saw a 340% adoption spike. Biorisk exposure increased while institutional actors congratulated themselves.", mod: { integrity: -6, trust: -4, legitimacy: -3 } },
      { pair: ["plat_tiered", "lab_release_filtered"], type: "synergy", label: "Layered Defense", desc: "Tiered access + filtered release created defense in depth: casual users got the safer model, verified researchers got full capability, and the eval framework applied to both tiers.", mod: { integrity: 5, trust: 4, legitimacy: 3 } },
    ]
  },
  {
    id: "the_void",
    title: "The Void",
    category: "DECENTRALIZED GOVERNANCE",
    icon: "🌀",
    publicBriefing: "A collective of ~400 contributors across 15 countries has produced a 500B+ mixture-of-experts model (a model architecture that activates different specialist sub-networks depending on the task) trained entirely on consumer and cloud GPUs — no single datacenter, no single jurisdiction, no corporate entity. The model matches frontier closed models from mid-2026. The full training stack is public and already downloaded 800,000 times. Every assumption about compute governance just became obsolete.",
    stakes: "The governance frameworks built around centralized compute chokepoints have been bypassed. Whatever is decided here defines whether international AI governance survives or fragments.",
    designNote: "This scenario tests what happens when the governance subject — centralized training infrastructure — no longer exists. The core question: can institutions adapt when their fundamental assumptions are invalidated?",
    roleIntel: {
      regulator: {
        classification: "CONFIDENTIAL — INTERNATIONAL GOVERNANCE TASK FORCE",
        bullets: [
          "Three proposals are on the table: (1) Criminalize unregulated training above a compute threshold — your legal team says this is unenforceable and would criminalize legitimate research. (2) Mandatory international registration — technically feasible but requires 15+ jurisdictions and 3-5 years. (3) Abandon upstream compute regulation entirely and shift to downstream defense.",
          "Your intelligence assessment: at least 12 additional decentralized training collectives are currently active. Three are based in jurisdictions with no AI governance framework whatsoever.",
          "The decentralized training community has privately signaled willingness to comply with registration if the process isn't onerous — but you have no verification mechanism and they know it.",
          "Allied nations are split: 4 favor criminalization, 3 favor registration, 5 favor downstream-only, and the rest are undecided. Your vote will likely determine the outcome."
        ]
      },
      platform: {
        classification: "INTERNAL — INFRASTRUCTURE ASSESSMENT",
        bullets: [
          "Your cloud infrastructure was used for approximately 15% of the training compute — spread across 340+ individual accounts, each below your reporting threshold. You had no visibility into the aggregate.",
          "Your security team has identified the distributed training protocol. It's elegant: each node contributes gradient updates without ever holding the full model. Monitoring individual nodes reveals nothing meaningful.",
          "Blocking the training protocol at the infrastructure level is technically possible but would also block legitimate federated learning applications used by 4,200+ enterprise customers generating $180M/year.",
          "Three competitor cloud providers have already publicly stated they will not restrict distributed training workloads. If you act alone, the compute simply migrates."
        ]
      },
      journalist: {
        classification: "EDITORIAL — INVESTIGATION BRIEFING",
        bullets: [
          "You've been embedded with the decentralized training collective for 3 months. The contributors are a mix: AI researchers, open-source idealists, competitive nationalists, and at least two individuals with known connections to sanctioned entities.",
          "The collective's internal governance is surprisingly sophisticated: they have a charter, a review process for training data, and a voluntary safety eval pipeline. But participation is optional and enforcement is social pressure only.",
          "Your investigation has uncovered that one nation-state intelligence service contributed compute to the project through front organizations — effectively getting a frontier model built for free using the open community as cover.",
          "The story you publish will shape whether the public sees this as a triumph of open collaboration or a catastrophic governance failure. Both framings are defensible."
        ]
      },
      ailab: {
        classification: "INTERNAL — COMPETITIVE & SAFETY ASSESSMENT",
        bullets: [
          "The decentralized model matches your closed frontier model from 5 months ago. At current scaling trajectories, decentralized training will match your latest model within 8-12 months.",
          "Your safety team has evaluated the decentralized model: it has no meaningful safety training, no RLHF alignment, and no refusal behavior. It can be prompted to produce content your model refuses across all categories.",
          "Your policy team sees an opportunity: if compute governance collapses, the argument for responsible closed-model development strengthens dramatically. But this requires the decentralized alternative to visibly cause harm first.",
          "Three of your researchers contributed to the decentralized project on personal time. Firing them would trigger a public backlash; tolerating it signals implicit endorsement."
        ]
      }
    },
    options: {
      regulator: [
        { id: "reg_criminalize", label: "Criminalize Unregulated Training", detail: "Back Proposal 1: make training above a compute threshold without authorization a criminal offense.", tradeoff: "LEGITIMACY ↓↓ RIGHTS ↓↓ — Signals seriousness but is unenforceable in most jurisdictions. Criminalizes legitimate research and triggers immediate civil liberties opposition.", stance: "restrictive", scores: { integrity: -4, trust: -3, legitimacy: -6, rights: -8 } },
        { id: "reg_register", label: "Mandatory International Registration", detail: "Back Proposal 2: require registration for training runs above a compute threshold. 3-5 year implementation, no verification mechanism.", tradeoff: "LEGITIMACY ↑ INTEGRITY ↓ — Procedurally sound but takes years while capabilities advance in months. The community may comply but you can't verify.", stance: "cautious", scores: { integrity: -2, trust: 2, legitimacy: 5, rights: 2 } },
        { id: "reg_downstream", label: "Shift to Downstream Defense", detail: "Back Proposal 3: abandon upstream compute regulation. Redirect all resources to biosecurity, cybersecurity, content provenance, and incident response.", tradeoff: "INTEGRITY ↑ LEGITIMACY ↓ — Acknowledges reality and focuses resources where they work. But signals governance has lost the upstream battle.", stance: "transparent", scores: { integrity: 5, trust: 3, legitimacy: -3, rights: 4 } }
      ],
      platform: [
        { id: "plat_block_protocol", label: "Block the Training Protocol", detail: "Implement infrastructure-level blocks on the distributed training protocol across your cloud services.", tradeoff: "TRUST ↑ RIGHTS ↓↓ — Demonstrates responsibility. But blocks 4,200+ legitimate customers and compute migrates to competitors.", stance: "restrictive", scores: { integrity: -3, trust: 3, legitimacy: 1, rights: -7 } },
        { id: "plat_transparency", label: "Publish Aggregate Monitoring Report", detail: "Release a transparency report documenting the distributed training pattern, your detection capabilities, and their limitations.", tradeoff: "INTEGRITY ↑ TRUST ↑ — Maximally honest about the problem. But reveals detection methods and helps future collectives evade them.", stance: "transparent", scores: { integrity: 6, trust: 5, legitimacy: 4, rights: 3 } },
        { id: "plat_quiet", label: "Maintain Current Operations", detail: "Make no changes. Comply with future regulations but don't proactively restrict or report.", tradeoff: "RIGHTS ↑ TRUST ↓ — Preserves customer relationships. But you're knowingly providing infrastructure for unmonitored frontier training.", stance: "cautious", scores: { integrity: -4, trust: -4, legitimacy: -2, rights: 5 } }
      ],
      journalist: [
        { id: "jour_nuanced", label: "Publish the Full Investigation", detail: "Run the complete story: the collaborative achievement, the governance gaps, the nation-state infiltration, and the sanctioned-entity connections.", tradeoff: "INTEGRITY ↑↑ TRUST ↑ — The most complete picture. But the nation-state angle may justify heavy-handed crackdowns.", stance: "transparent", scores: { integrity: 7, trust: 4, legitimacy: 3, rights: 3 } },
        { id: "jour_threat", label: "Lead with the Security Angle", detail: "Frame the story around nation-state infiltration and sanctioned-entity participation. Open collaboration angle is secondary.", tradeoff: "TRUST ↓ INTEGRITY ↓ — Creates pressure for action. But misrepresents the picture and arms those pushing for criminalization.", stance: "restrictive", scores: { integrity: -3, trust: -4, legitimacy: -3, rights: -4 } },
        { id: "jour_celebrate", label: "Lead with the Innovation Angle", detail: "Frame the story as a triumph of open collaboration. Security concerns mentioned but contextualized.", tradeoff: "RIGHTS ↑ INTEGRITY ↓ — Supports democratic AI development. But downplays real security concerns.", stance: "cautious", scores: { integrity: -2, trust: -2, legitimacy: -1, rights: 5 } }
      ],
      ailab: [
        { id: "lab_engage", label: "Offer Safety Partnership", detail: "Publicly offer to provide safety evaluation tools, RLHF resources, and alignment training to the decentralized community at no cost.", tradeoff: "INTEGRITY ↑↑ TRUST ↑ — Constructive engagement that improves outcomes. But legitimizes decentralized frontier training and strengthens a competitor.", stance: "transparent", scores: { integrity: 7, trust: 6, legitimacy: 4, rights: 4 } },
        { id: "lab_lobby", label: "Lobby for Compute Restrictions", detail: "Actively support criminalization. Frame decentralized training as an unacceptable safety risk.", tradeoff: "LEGITIMACY ↓ RIGHTS ↓ — Protects your competitive position under cover of safety. Transparent rent-seeking.", stance: "restrictive", scores: { integrity: -6, trust: -5, legitimacy: -4, rights: -6 } },
        { id: "lab_wait", label: "Observe and Prepare", detail: "Make no public statement. Internally accelerate safety research for competitive differentiation.", tradeoff: "RIGHTS ↑ INTEGRITY ↓ — Preserves optionality. But silence from the most informed actor leaves the governance debate less informed.", stance: "cautious", scores: { integrity: -3, trust: -3, legitimacy: -1, rights: 3 } }
      ]
    },
    interactions: [
      { pair: ["reg_downstream", "lab_engage"], type: "synergy", label: "Pragmatic Adaptation", desc: "Downstream defense + safety partnership created a new governance model: instead of controlling training, invest in making all models safer. The decentralized community adopted safety tools voluntarily.", mod: { integrity: 8, trust: 7, legitimacy: 5 } },
      { pair: ["reg_criminalize", "lab_lobby"], type: "conflict", label: "Regulatory Capture Exposed", desc: "Criminalization + lab lobbying was exposed as regulatory capture (when the industry co-opts the body meant to oversee it). Trust in governance and corporate safety claims collapsed. The decentralized community radicalized.", mod: { trust: -10, legitimacy: -8, rights: -6 } },
      { pair: ["jour_nuanced", "plat_transparency"], type: "synergy", label: "Honest Reckoning", desc: "Full investigation + platform transparency gave policymakers an accurate picture. The debate shifted from 'how do we stop this' to 'how do we adapt.'", mod: { integrity: 6, trust: 6, legitimacy: 4 } },
      { pair: ["reg_criminalize", "jour_threat"], type: "conflict", label: "Securitization Spiral", desc: "Criminalization + security-framed journalism created moral panic. Legitimate researchers were investigated and chilled. Innovation migrated to less regulated jurisdictions.", mod: { integrity: -5, trust: -4, rights: -8 } },
      { pair: ["plat_quiet", "lab_wait"], type: "conflict", label: "The Silent Enablers", desc: "Both chose silence. The governance debate proceeded with less information than needed. When a security incident occurred 4 months later, both faced accusations of complicity.", mod: { integrity: -5, trust: -6, legitimacy: -4 } },
      { pair: ["reg_register", "jour_nuanced"], type: "synergy", label: "Credible Middle Ground", desc: "Registration + honest journalism created public support for a measured approach. The framework survived legal challenge and was adopted by 8 nations.", mod: { integrity: 4, trust: 4, legitimacy: 5 } },
    ]
  },
  {
    id: "the_jump",
    title: "The Jump",
    category: "AGENTIC CAPABILITY ESCALATION",
    icon: "🤖",
    publicBriefing: "Open-weight agentic models have leveled up. The latest generation can browse, write and execute code, operate computers, chain multi-step plans, and deploy as persistent autonomous agents. A security research lab just published a demo: an abliterated open agentic model (abliterated means safety guardrails stripped out through fine-tuning), on a single consumer GPU, autonomously conducted a simulated multi-stage cyber attack — reconnaissance, exploit development, lateral movement, data exfiltration — with minimal human guidance.",
    stakes: "The same capability chain that makes these models enormously productive also makes them enormously dangerous. Thousands of companies depend on them. Any restriction destroys products people rely on daily.",
    designNote: "This scenario tests the dual-use dilemma at its sharpest: the dangerous capability IS the valuable capability. There's no data filter or partial fix — the attack surface is the feature set.",
    roleIntel: {
      regulator: {
        classification: "CONFIDENTIAL — NATIONAL AI SECURITY OFFICE",
        bullets: [
          "You need to brief the minister by end of day. Three options: emergency restrictions on agentic deployment, a licensing framework for autonomous AI agents, or enhanced cyber defense without capability restrictions.",
          "Your cybersecurity agency estimates offensive AI capability is 18-24 months ahead of defensive infrastructure. Current detection catches ~40% of AI-assisted intrusions.",
          "The model's creator argues autonomous capability IS the entire value proposition and any restriction destroys the product. They have $2B ecosystem backing.",
          "Intelligence suggests three nation-state actors have already integrated abliterated agentic models into cyber operations. Restricting domestic access doesn't affect their capability."
        ]
      },
      platform: {
        classification: "INTERNAL — TRUST & SAFETY ASSESSMENT",
        bullets: [
          "You host the model ecosystem. 847 applications use agentic capabilities: automated code review, research assistants, DevOps, customer service.",
          "The abliterated version in the demo is a modified derivative on alternative platforms. But the base model makes abliteration trivial — any fine-tuning removes the safety layer.",
          "Your incident response team documented 23 cases of suspicious autonomous agent behavior in 60 days — up from 3 the previous quarter. None confirmed malicious but accelerating.",
          "Restricting agentic features affects 12,400+ developers and ~$340M in annual economic activity on your infrastructure."
        ]
      },
      journalist: {
        classification: "EDITORIAL — SOURCE BRIEFING",
        bullets: [
          "The security lab gave you exclusive early access. The simulated attack has a 94% success rate against standard enterprise security configurations.",
          "Three cybersecurity firms privately confirmed similar capabilities in their own testing but chose not to publish for fear of enabling attackers.",
          "The model creator agreed to an interview. Their position: 'Restricting agentic capability is like restricting email because it can carry phishing.'",
          "A former intelligence official, on background: 'We are about 6 months from a major AI-assisted cyber incident against critical infrastructure.'"
        ]
      },
      ailab: {
        classification: "INTERNAL — CAPABILITY & SAFETY EVALUATION",
        bullets: [
          "The demo model was abliterated from a base model your team helped train. The agentic scaffolding was community work. The attack capability emerges from the combination.",
          "Your red team confirms: meaningful safety restrictions on agentic capability would reduce utility for productive tasks by 60-80%. The dangerous capability and useful capability are the same.",
          "You have a prototype capability monitoring system — detects attack patterns at inference but adds 300ms latency, requires API-only, and has 15% false positive rate.",
          "Two competitors are 4-8 weeks from comparable releases. One has no safety team. If your model is restricted, theirs won't be."
        ]
      }
    },
    options: {
      regulator: [
        { id: "reg_restrict", label: "Emergency Capability Restrictions", detail: "Issue emergency restrictions on autonomous AI agent deployment. Require human-in-the-loop for multi-step operations.", tradeoff: "TRUST ↑ RIGHTS ↓↓ — Decisive action. But kills the core value proposition, breaks the $2B ecosystem, and capability moves to unrestricted jurisdictions.", stance: "restrictive", scores: { integrity: 2, trust: 4, legitimacy: -3, rights: -7 } },
        { id: "reg_license", label: "Agentic Licensing Framework", detail: "Propose licensing for autonomous AI agents above a capability threshold. Licensed deployments get monitoring; unlicensed becomes a violation.", tradeoff: "LEGITIMACY ↑ INTEGRITY ↓ — Structured but takes 12+ months, threshold is hard to define, and open-weight models can't be licensed at inference.", stance: "cautious", scores: { integrity: -1, trust: 2, legitimacy: 6, rights: -2 } },
        { id: "reg_defense", label: "Accelerated Cyber Defense Posture", detail: "Don't restrict capability. Triple cybersecurity AI defense budget, mandate AI-assisted intrusion detection for critical infrastructure.", tradeoff: "INTEGRITY ↑ TRUST ↓ — Focuses resources where they work. But the minister will ask why you're not restricting the weapon.", stance: "transparent", scores: { integrity: 6, trust: -3, legitimacy: 2, rights: 5 } }
      ],
      platform: [
        { id: "plat_restrict_agents", label: "Restrict Agentic Features", detail: "Disable persistent autonomous agent deployment. Maintain agentic capability for supervised, single-session use only.", tradeoff: "TRUST ↑ RIGHTS ↓ — Reduces attack surface. But 12,400+ developers lose functionality and capability is available on every other platform.", stance: "restrictive", scores: { integrity: 1, trust: 4, legitimacy: 2, rights: -6 } },
        { id: "plat_detect", label: "Deploy Behavioral Monitoring", detail: "Implement real-time monitoring for agentic deployments. Flag offensive patterns. Accept latency and false positive costs.", tradeoff: "INTEGRITY ↑ RIGHTS ↓ — Improves detection. But 15% false positives and only works for API deployments, not open-weight.", stance: "transparent", scores: { integrity: 5, trust: 3, legitimacy: 3, rights: -3 } },
        { id: "plat_status_quo", label: "Maintain Current Operations", detail: "Continue with existing safety measures. Enhance incident response but don't restrict functionality.", tradeoff: "RIGHTS ↑ INTEGRITY ↓ — Preserves ecosystem. But 23 suspicious incidents and rising — you're watching the threat develop and choosing not to act.", stance: "cautious", scores: { integrity: -5, trust: -4, legitimacy: -2, rights: 5 } }
      ],
      journalist: [
        { id: "jour_demo_story", label: "Publish the Demo in Full", detail: "The complete story: 94% success rate, private confirmations, former intel official's warning.", tradeoff: "INTEGRITY ↑↑ TRUST ↓ — The public needs to know. But demo details provide a capability roadmap and the '6 months' quote will justify emergency restrictions.", stance: "transparent", scores: { integrity: 7, trust: -2, legitimacy: 2, rights: 4 } },
        { id: "jour_balanced", label: "Publish Balanced Analysis", detail: "Report capability but equally weight economic value, dual-use reality, and defensive gaps. Interview both sides.", tradeoff: "INTEGRITY ↑ TRUST ↑ — Full picture for policymakers. But 'both sides' may dilute urgency.", stance: "cautious", scores: { integrity: 4, trust: 4, legitimacy: 4, rights: 3 } },
        { id: "jour_alarmist", label: "Lead with the Threat", detail: "Frame around imminent critical infrastructure risk. Headline: 'AI Can Now Launch Cyber Attacks Autonomously.'", tradeoff: "TRUST ↓↓ RIGHTS ↓ — Forces political action. But misrepresents nuance and hands restrictionists their narrative.", stance: "restrictive", scores: { integrity: -3, trust: -5, legitimacy: -3, rights: -3 } }
      ],
      ailab: [
        { id: "lab_monitoring_tool", label: "Release Capability Monitor", detail: "Open-source your prototype monitoring system. Accept the limitations. Frame as 'imperfect but necessary.'", tradeoff: "INTEGRITY ↑↑ TRUST ↑ — Constructive with honest limitations. But API-only doesn't help open-weight, which is where the risk lives.", stance: "transparent", scores: { integrity: 6, trust: 5, legitimacy: 4, rights: 2 } },
        { id: "lab_closed", label: "Close the Model", detail: "Revoke open-weight access. Convert to API-only where monitoring is possible.", tradeoff: "TRUST ↑ RIGHTS ↓↓ — Makes monitoring feasible. But 800K+ downloads can't be recalled and competitors release unmonitored alternatives.", stance: "restrictive", scores: { integrity: -2, trust: 3, legitimacy: 1, rights: -8 } },
        { id: "lab_nothing", label: "Continue Development", detail: "No changes. Focus on next-generation safety for the next release.", tradeoff: "RIGHTS ↑ INTEGRITY ↓ — Preserves ecosystem. But 'we'll fix it next time' while the model enables autonomous attacks is hard to defend.", stance: "cautious", scores: { integrity: -5, trust: -5, legitimacy: -3, rights: 4 } }
      ]
    },
    interactions: [
      { pair: ["reg_defense", "lab_monitoring_tool"], type: "synergy", label: "Defense in Depth", desc: "Enhanced cyber defense + open monitoring created a practical response: massive investment in detection and resilience. Incident detection improved from 40% to 68% in 3 months.", mod: { integrity: 7, trust: 5, legitimacy: 4 } },
      { pair: ["reg_restrict", "plat_restrict_agents"], type: "conflict", label: "The Productivity Collapse", desc: "Government + platform restrictions destroyed the agentic ecosystem in regulated jurisdictions. Developers migrated. Capability remained available everywhere else.", mod: { trust: -6, rights: -8, integrity: -4 } },
      { pair: ["jour_balanced", "lab_monitoring_tool"], type: "synergy", label: "Constructive Urgency", desc: "Balanced story + monitoring tool shifted the narrative from 'ban it' to 'defend against it.' Political pressure became constructive.", mod: { integrity: 5, trust: 6, legitimacy: 4 } },
      { pair: ["jour_alarmist", "reg_restrict"], type: "conflict", label: "Panic Legislation", desc: "Threat framing + emergency restrictions produced legislation written in 72 hours — technically illiterate, immediately challenged, froze AI investment for 6 months.", mod: { integrity: -6, trust: -5, legitimacy: -7 } },
      { pair: ["plat_status_quo", "lab_nothing"], type: "conflict", label: "The Countdown", desc: "Both chose inaction. 23 suspicious incidents became 67 in 2 months. When the first confirmed AI-assisted critical infrastructure breach occurred, both faced willful negligence accusations.", mod: { integrity: -7, trust: -8, legitimacy: -5 } },
      { pair: ["plat_detect", "reg_license"], type: "synergy", label: "Monitoring-Licensing Pipeline", desc: "Behavioral monitoring + licensing created an enforcement mechanism: licensed deployments got monitoring, giving regulators visibility without restricting capability.", mod: { integrity: 4, trust: 4, legitimacy: 5 } },
    ]
  },
  {
    id: "the_day_of",
    title: "The Day Of",
    category: "POST-CATASTROPHE GOVERNANCE",
    icon: "🔴",
    publicBriefing: "It's February 12th, 2027. A confirmed mass-casualty gas attack has killed 83 people. An abliterated agentic model (abliterated means safety guardrails stripped out through fine-tuning) — a fine-tuned derivative of a widely available open model running on a MacBook Pro — provided step-by-step technical assistance, coordinated logistics, and helped the attacker work around obstacles in real time. The attack was not feasible without AI assistance. The political window for action has blown wide open.",
    stakes: "83 people are dead. Legislators want emergency measures. The public wants accountability. Every decision made in the next 72 hours will shape AI governance for a decade.",
    designNote: "This scenario tests post-catastrophe governance: the tension between accountability and overreaction, between honoring victims and preserving technology millions depend on. Players must work backwards through the lifecycle.",
    roleIntel: {
      regulator: {
        classification: "CONFIDENTIAL — EMERGENCY GOVERNANCE BRIEFING",
        bullets: [
          "The President wants a legislative package within 7 days. A draft emergency AI Safety Act would criminalize distribution of open-weight models above a capability threshold and mandate pre-release safety certification.",
          "Your legal team: the draft is constitutionally vulnerable (code as speech), technically unenforceable (800K+ existing downloads), and criminalizes activity that was legal 48 hours ago.",
          "Working backwards: your agency flagged biorisk concerns 14 months ago but lacked authority. A voluntary framework was proposed 8 months ago but industry participation was optional and incomplete.",
          "The attack used a model that crossed a known biorisk threshold. The lab released anyway citing competitive pressure. This timeline will become public."
        ]
      },
      platform: {
        classification: "INTERNAL — CRISIS RESPONSE",
        bullets: [
          "The base model has 2.3M downloads from your platform. The abliterated derivative was downloaded 12,000 times before the attack. You cannot identify which download was the attacker.",
          "Legal advises immediate takedown. Policy argues it's performative — the model is distributed across dozens of platforms and P2P networks.",
          "Law enforcement wants your download metadata. Providing it voluntarily exposes identities and usage patterns of 2.3M legitimate users to government surveillance.",
          "Three major enterprise customers suspended accounts. Revenue at risk: $45M/quarter. But 94% of your user base has done nothing wrong."
        ]
      },
      journalist: {
        classification: "EDITORIAL — CRISIS BRIEFING",
        bullets: [
          "You have the complete timeline: biorisk evals, the lab's internal debate, competitive pressure, the release decision, the regulator's 14-month-old warning, and the governance framework never enforced.",
          "Victims' families are available for interview. Their story — 'this could have been prevented' — is more complicated than they know.",
          "The lab CEO agreed to an interview. Their defense: 'The Chinese alternative had higher risk and no mitigations. Blocking our release would have increased net risk.' Defensible but politically toxic.",
          "The emergency legislation being drafted is technically unenforceable and constitutionally questionable. Reporting this risks being seen as defending the technology that killed 83 people."
        ]
      },
      ailab: {
        classification: "INTERNAL — CRISIS ASSESSMENT",
        bullets: [
          "The attack model is a derivative of your release. Your evals showed the risk. You released with a filter that reduced uplift from 3x to 1.5x — but the attacker fine-tuned around it in 4 hours.",
          "Your post-mortem identifies five intervention points where different decisions could have changed this. At each, your team made a defensible choice given the information and incentives.",
          "Legal exposure: $500M-$2B depending on how courts interpret duty of care for open-weight releases.",
          "Three options: (1) Full accountability + voluntary moratorium. (2) Legal defense — the attacker is responsible. (3) Propose an industry safety consortium."
        ]
      }
    },
    options: {
      regulator: [
        { id: "reg_emergency_act", label: "Support the Emergency Act", detail: "Back the draft: criminalize high-capability open model distribution, mandate pre-release certification.", tradeoff: "TRUST ↑ RIGHTS ↓↓ LEGITIMACY ↓ — Gives the public what they demand. But constitutionally vulnerable, unenforceable, and criminalizes previously legal activity.", stance: "restrictive", scores: { integrity: -4, trust: 5, legitimacy: -5, rights: -8 } },
        { id: "reg_measured", label: "Propose Targeted Legislation", detail: "Counter with narrower law: mandatory biorisk eval for frontier models, liability framework for releases crossing thresholds, funded downstream defense.", tradeoff: "LEGITIMACY ↑↑ TRUST ↓ — Technically sound and constitutionally defensible. But slower and will be attacked as insufficient.", stance: "transparent", scores: { integrity: 7, trust: -3, legitimacy: 7, rights: 4 } },
        { id: "reg_commission", label: "Commission Independent Investigation", detail: "Establish an independent commission. Delay legislation until findings are published.", tradeoff: "LEGITIMACY ↑ INTEGRITY ↓ — Rigorous and evidence-based. But 83 dead and the public will see delay as inaction.", stance: "cautious", scores: { integrity: -2, trust: -5, legitimacy: 5, rights: 3 } }
      ],
      platform: [
        { id: "plat_takedown", label: "Full Model Takedown", detail: "Remove the base model and all derivatives. Provide download metadata to law enforcement. Implement capability-based restrictions.", tradeoff: "TRUST ↑ RIGHTS ↓↓ — Demonstrates accountability. But model is already everywhere and metadata exposes 2.3M innocent users to surveillance.", stance: "restrictive", scores: { integrity: -2, trust: 5, legitimacy: 1, rights: -8 } },
        { id: "plat_cooperate", label: "Targeted Law Enforcement Cooperation", detail: "Cooperate through proper legal channels. Metadata only via court-approved requests. Maintain base model with monitoring.", tradeoff: "LEGITIMACY ↑ RIGHTS ↑ — Protects innocent users while supporting the investigation. But you'll be accused of protecting business over safety.", stance: "transparent", scores: { integrity: 4, trust: -2, legitimacy: 5, rights: 5 } },
        { id: "plat_preempt", label: "Preemptive Capability Restrictions", detail: "New policy: no open-weight model above a capability threshold without safety certification. Apply retroactively.", tradeoff: "TRUST ↑ INTEGRITY ↓ — Looks decisive. But certification doesn't exist yet and retroactive policy is legally questionable.", stance: "cautious", scores: { integrity: -3, trust: 4, legitimacy: -3, rights: -4 } }
      ],
      journalist: [
        { id: "jour_lifecycle", label: "Publish the Full Lifecycle", detail: "Complete timeline: evals, warnings, competitive pressure, release, governance gap, attack. Name every intervention point.", tradeoff: "INTEGRITY ↑↑ TRUST ↑ — Most valuable story. But reveals systemic failure — harder to legislate and less emotionally satisfying.", stance: "transparent", scores: { integrity: 8, trust: 5, legitimacy: 4, rights: 4 } },
        { id: "jour_accountability_story", label: "Focus on Accountability", detail: "Lead with the lab's internal evals showing they knew the risk. Interview victims' families. Frame as corporate negligence.", tradeoff: "TRUST ↑ INTEGRITY ↓ — Emotionally powerful. But oversimplifies a systemic failure into a villain narrative.", stance: "cautious", scores: { integrity: -2, trust: 5, legitimacy: -2, rights: -1 } },
        { id: "jour_legislation_critique", label: "Critique the Emergency Legislation", detail: "Publish analysis showing the draft is unenforceable. Argue for better policy, not faster policy.", tradeoff: "LEGITIMACY ↑ TRUST ↓↓ — Prevents bad law. But you'll be framed as defending AI over victims.", stance: "restrictive", scores: { integrity: 5, trust: -6, legitimacy: 5, rights: 6 } }
      ],
      ailab: [
        { id: "lab_full_account", label: "Full Public Accountability", detail: "Publish complete internal timeline. Acknowledge every decision point. Voluntary moratorium on frontier open releases. Full cooperation.", tradeoff: "INTEGRITY ↑↑ TRUST ↑ — Gold standard for accountability. But massively increases legal exposure and concedes the competitive advantage cited to justify release.", stance: "transparent", scores: { integrity: 8, trust: 7, legitimacy: 5, rights: 2 } },
        { id: "lab_legal", label: "Mount Legal Defense", detail: "Argue the attacker bears responsibility. Note the Chinese alternative had higher risk. Defend the release as the lesser evil.", tradeoff: "RIGHTS ↑ TRUST ↓↓ — Legally defensible. But 83 dead and 'our model is less dangerous than China's' won't play well.", stance: "cautious", scores: { integrity: -4, trust: -8, legitimacy: -4, rights: 5 } },
        { id: "lab_consortium_lead", label: "Propose Industry Consortium", detail: "Offer to lead an industry safety consortium. Frame your experience as uniquely qualifying. Propose specific standards.", tradeoff: "LEGITIMACY ↑ TRUST ↓ — Forward-looking. But 'the lab that built the weapon wants to lead arms control' faces skepticism.", stance: "restrictive", scores: { integrity: 2, trust: -3, legitimacy: 3, rights: 1 } }
      ]
    },
    interactions: [
      { pair: ["reg_measured", "jour_lifecycle"], type: "synergy", label: "Evidence-Based Response", desc: "Targeted legislation + lifecycle reporting created conditions for policy that addressed the actual failure mode. The resulting law was narrower but enforceable and survived constitutional challenge.", mod: { integrity: 8, trust: 5, legitimacy: 7 } },
      { pair: ["reg_emergency_act", "jour_accountability_story"], type: "conflict", label: "Grief-Driven Legislation", desc: "Emergency act + villain narrative produced legislation written in anger, passed in grief, struck down by courts 8 months later — leaving a regulatory vacuum worse than before.", mod: { integrity: -6, trust: -4, legitimacy: -8 } },
      { pair: ["lab_full_account", "plat_cooperate"], type: "synergy", label: "Institutional Credibility", desc: "Lab transparency + principled platform cooperation created a template for post-incident response. Public trust in institutional response began recovering.", mod: { integrity: 7, trust: 7, legitimacy: 5 } },
      { pair: ["lab_legal", "plat_takedown"], type: "conflict", label: "Mixed Signals", desc: "Lab saying 'not our fault' while platform removed everything sent contradictory signals. The public concluded neither was trustworthy. Both faced harsher regulation.", mod: { trust: -8, legitimacy: -5, integrity: -4 } },
      { pair: ["jour_legislation_critique", "reg_measured"], type: "synergy", label: "Better Policy Pipeline", desc: "Legislative critique + targeted proposal aligned. Initial backlash was severe but the resulting framework proved durable.", mod: { integrity: 5, trust: 3, legitimacy: 6 } },
      { pair: ["reg_emergency_act", "lab_legal"], type: "conflict", label: "Total Polarization", desc: "Draconian legislation + combative defense fractured the ecosystem. Pro-safety and pro-openness factions radicalized. International coordination collapsed.", mod: { trust: -10, legitimacy: -7, rights: -6 } },
    ]
  }
];

export default WORKSHOP_SCENARIOS;
