/**
 * Scenario registry.
 *
 * Every folder under src/scenarios/ that contains a scenario.json is picked up
 * automatically. No import lists to maintain. To add a scenario: add a folder.
 * To retire one: set meta.status to "archived" (still playable by URL) or
 * delete the folder.
 *
 * Translation overlays (fr.json, and any future <lang>.json) in the same
 * folder are registered with i18next under `scenarios.<id>.*`, which is the
 * key shape useTranslatedCrisis expects.
 */
import i18n from "../i18n";
import type { Scenario, ScenarioTranslation, Collection, ScenarioStatus } from "./types";

export type { Scenario, Role, Option, Interaction, ScenarioMeta } from "./types";
export { DEFAULT_ROLES, rolesFor } from "./roles";

const scenarioModules = import.meta.glob<{ default: Scenario }>("./*/scenario.json", { eager: true });
const translationModules = import.meta.glob<{ default: ScenarioTranslation }>("./*/[a-z][a-z].json", { eager: true });

const today = new Date().toISOString().slice(0, 10);

function effectiveStatus(s: Scenario): ScenarioStatus {
  const st = s.meta?.status ?? "live";
  if (st === "featured" && s.meta.featuredUntil && s.meta.featuredUntil < today) return "live";
  return st;
}

const COLLECTION_ORDER: Collection[] = ["core", "topical", "lifecycle"];
const STATUS_RANK: Record<ScenarioStatus, number> = { featured: 0, live: 1, archived: 2, draft: 3 };

/** Every scenario in the repo, including drafts and archived. Sorted by collection, status, order. */
export const REGISTRY: Scenario[] = Object.values(scenarioModules)
  .map(m => m.default)
  .sort((a, b) =>
    COLLECTION_ORDER.indexOf(a.meta.collection) - COLLECTION_ORDER.indexOf(b.meta.collection) ||
    STATUS_RANK[effectiveStatus(a)] - STATUS_RANK[effectiveStatus(b)] ||
    a.meta.order - b.meta.order
  );

/** Scenarios shown on the select screen and used by Quick Play. */
export const ALL_SCENARIOS: Scenario[] = REGISTRY.filter(s => {
  const st = effectiveStatus(s);
  if (st === "archived") return false;
  if (st === "draft") return import.meta.env.DEV;
  return true;
});

export const FEATURED_SCENARIOS = ALL_SCENARIOS.filter(s => effectiveStatus(s) === "featured");
export const CORE_SCENARIOS = ALL_SCENARIOS.filter(s => s.meta.collection === "core");
export const WORKSHOP_SCENARIOS = ALL_SCENARIOS.filter(s => s.meta.collection === "lifecycle");
export const TOPICAL_SCENARIOS = ALL_SCENARIOS.filter(s => s.meta.collection === "topical");

/** Collections present in ALL_SCENARIOS, in display order, with their members. */
export const COLLECTIONS: { key: Collection; scenarios: Scenario[] }[] = COLLECTION_ORDER
  .map(key => ({ key, scenarios: ALL_SCENARIOS.filter(s => s.meta.collection === key) }))
  .filter(c => c.scenarios.length > 0);

/** Look up by id, including archived scenarios so old links keep working. */
export function getScenarioById(id: string): Scenario | undefined {
  return REGISTRY.find(s => s.id === id);
}

export function isFeatured(s: Scenario): boolean {
  return effectiveStatus(s) === "featured";
}

// Register translation overlays with i18next.
for (const [file, mod] of Object.entries(translationModules)) {
  const lang = file.match(/\/([a-z]{2})\.json$/)?.[1];
  const folder = file.split("/")[1];
  const scenario = Object.entries(scenarioModules).find(([p]) => p.split("/")[1] === folder)?.[1].default;
  if (!lang || !scenario) continue;
  i18n.addResourceBundle(lang, "translation", { scenarios: { [scenario.id]: mod.default } }, true, true);
}
