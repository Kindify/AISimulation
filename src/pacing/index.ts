/**
 * Pacing Problem event registry. events.json is the English source of truth;
 * fr.json (and any future <lang>.json) is a translation overlay registered
 * under `scenarios.pacing_event_<id>.*`, the key shape PacingProblem.tsx reads.
 */
import i18n from "../i18n";
import events from "./events.json";

export interface PacingOutcome {
  label: string;
  detail: string;
  headline: string;
  credibility: number;
  capture: number;
  obsolescence: number;
  publicTrust: number;
}

export interface PacingEvent {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  bandwidthCost: number;
  speedOutcome: PacingOutcome;
  rigourOutcome: PacingOutcome;
  balancedOutcome: PacingOutcome;
}

export const EVENTS: PacingEvent[] = events as PacingEvent[];

const overlays = import.meta.glob<{ default: Record<string, unknown> }>("./[a-z][a-z].json", { eager: true });
for (const [file, mod] of Object.entries(overlays)) {
  const lang = file.match(/\/([a-z]{2})\.json$/)?.[1];
  if (!lang) continue;
  i18n.addResourceBundle(lang, "translation", { scenarios: mod.default }, true, true);
}
