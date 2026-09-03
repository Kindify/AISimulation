/**
 * Scenario schema. scenario.json in each scenario folder is the English
 * source of truth; fr.json (and any future <lang>.json) is a translation
 * overlay with the same shape for the player-facing string fields only.
 */

export type MetricKey = "integrity" | "trust" | "legitimacy" | "rights";
export type Scores = Partial<Record<MetricKey, number>>;
export type Stance = "transparent" | "restrictive" | "cautious";

export type ScenarioStatus = "draft" | "featured" | "live" | "archived";
export type Collection = "core" | "lifecycle" | "topical";

export interface Role {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  role: string;
  incentive: string;
}

export interface RoleIntel {
  classification: string;
  bullets: string[];
}

export interface Option {
  id: string;
  label: string;
  detail: string;
  tension: string;
  stance: Stance;
  scores: Scores;
}

export interface Interaction {
  pair: [string, string];
  type: "synergy" | "conflict";
  label: string;
  desc: string;
  mod: Scores;
}

export interface ScenarioSource {
  label: string;
  url?: string;
}

export interface ScenarioMeta {
  /** Which group the scenario is listed under on the select screen. */
  collection: Collection;
  /** draft: excluded from production. featured: pinned first. live: listed. archived: hidden from lists but still playable by URL. */
  status: ScenarioStatus;
  /** Sort order within the collection (ascending). */
  order: number;
  /** ISO date of the reporting the scenario is based on (topical scenarios). */
  sourceDate?: string;
  /** ISO date the content was last checked for accuracy. */
  reviewedOn?: string;
  /** ISO date after which a featured scenario is treated as live. */
  featuredUntil?: string;
  /** Scenario id that replaces this one, shown when archived. */
  supersededBy?: string | null;
  sources?: ScenarioSource[];
}

export interface Scenario {
  id: string;
  title: string;
  category: string;
  icon: string;
  publicBriefing: string;
  stakes: string;
  designNote?: string;
  /** Optional per-scenario cast. Falls back to DEFAULT_ROLES when absent. */
  roles?: Role[];
  roleIntel: Record<string, RoleIntel>;
  options: Record<string, Option[]>;
  interactions: Interaction[];
  meta: ScenarioMeta;
  /** Legacy free-text fields kept for older scenario files. */
  sourceDate?: string;
  sourceNote?: string;
}

/** Shape of a translation overlay (fr.json). All fields optional. */
export interface ScenarioTranslation {
  title?: string;
  category?: string;
  publicBriefing?: string;
  stakes?: string;
  designNote?: string;
  roleIntel?: Record<string, { classification?: string; bullets?: string[] }>;
  options?: Record<string, Record<string, { label?: string; detail?: string; tension?: string }>>;
  interactions?: { label?: string; desc?: string }[];
}
