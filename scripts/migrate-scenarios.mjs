#!/usr/bin/env node
/**
 * One-time migration: flat src/scenarios/*.json + src/locales/fr.json
 *   -> src/scenarios/<slug>/scenario.json + fr.json
 * and strips the `scenarios` block out of src/locales/fr.json.
 *
 * Safe to re-run: it skips scenarios already migrated.
 * Usage: node scripts/migrate-scenarios.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL(".", import.meta.url).pathname, "..");
const scenDir = path.join(root, "src/scenarios");
const frPath = path.join(root, "src/locales/fr.json");

// Collection and order mirror the previous hand-maintained index.ts.
const LEGACY_INDEX = {
  core: ["synthetic-candidate", "invisible-epidemic"],
  lifecycle: ["the-crossing", "the-void", "the-jump", "the-day-of"],
  topical: ["sovereign-dna-mandate", "export-control-precedent"],
};

const fr = JSON.parse(fs.readFileSync(frPath, "utf8"));
const frScenarios = fr.scenarios || {};
let migrated = 0;

for (const file of fs.readdirSync(scenDir).filter(f => f.endsWith(".json"))) {
  const slug = file.replace(/\.json$/, "");
  const src = path.join(scenDir, file);
  const dest = path.join(scenDir, slug);
  if (fs.existsSync(dest)) { console.log(`skip ${slug} (already a folder)`); continue; }

  const scenario = JSON.parse(fs.readFileSync(src, "utf8"));
  const collection = Object.keys(LEGACY_INDEX).find(c => LEGACY_INDEX[c].includes(slug)) || "topical";
  const order = (LEGACY_INDEX[collection] || []).indexOf(slug);

  scenario.meta = {
    collection,
    status: "live",
    order: order >= 0 ? order + 1 : 99,
    ...(scenario.sourceDate ? { sourceDate: toIso(scenario.sourceDate) } : {}),
    reviewedOn: new Date().toISOString().slice(0, 10),
    supersededBy: null,
    sources: [],
    ...(scenario.meta || {}),
  };

  fs.mkdirSync(dest);
  fs.writeFileSync(path.join(dest, "scenario.json"), JSON.stringify(scenario, null, 2) + "\n");
  const tr = frScenarios[scenario.id];
  if (tr) {
    fs.writeFileSync(path.join(dest, "fr.json"), JSON.stringify(tr, null, 2) + "\n");
  } else {
    console.warn(`WARNING: no French translation found for ${scenario.id}`);
  }
  fs.unlinkSync(src);
  migrated++;
  console.log(`migrated ${slug} -> ${slug}/scenario.json${tr ? " + fr.json" : ""}`);
}

if (fr.scenarios) {
  delete fr.scenarios;
  fs.writeFileSync(frPath, JSON.stringify(fr, null, 2) + "\n");
  console.log("removed scenarios block from src/locales/fr.json");
}
console.log(`done: ${migrated} scenario(s) migrated`);

function toIso(s) {
  // "June 2026" -> "2026-06-01", "June 28, 2026" -> "2026-06-28"; otherwise leave as-is.
  const d = new Date(s.match(/\d{1,2},/) ? s : `1 ${s}`);
  return isNaN(d) ? s : d.toISOString().slice(0, 10);
}
