#!/usr/bin/env node
/**
 * Scenario validator. Runs before every build (see package.json "build").
 * Exits non-zero on any error so a broken scenario cannot deploy.
 *
 * Usage: node scripts/validate-scenarios.mjs [--strict]   (--strict turns warnings into errors)
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL(".", import.meta.url).pathname, "..");
const scenDir = path.join(root, "src/scenarios");
const strict = process.argv.includes("--strict");
const STANCES = ["transparent", "restrictive", "cautious"];
const METRICS = ["integrity", "trust", "legitimacy", "rights"];
const STATUSES = ["draft", "featured", "live", "archived"];
const COLLECTIONS = ["core", "lifecycle", "topical"];
const STALE_DAYS = 90;

const errors = [], warnings = [];
const err = (s, m) => errors.push(`${s}: ${m}`);
const warn = (s, m) => warnings.push(`${s}: ${m}`);
const isoDate = v => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

const folders = fs.readdirSync(scenDir).filter(f => fs.existsSync(path.join(scenDir, f, "scenario.json")));
const seenIds = new Map();
const allIds = new Set();

for (const folder of folders) {
  const dir = path.join(scenDir, folder);
  let s;
  try { s = JSON.parse(fs.readFileSync(path.join(dir, "scenario.json"), "utf8")); }
  catch (e) { err(folder, `scenario.json is not valid JSON: ${e.message}`); continue; }
  const tag = folder;

  // Identity
  for (const k of ["id", "title", "category", "icon", "publicBriefing", "stakes"]) if (!s[k]) err(tag, `missing "${k}"`);
  if (s.id) {
    if (seenIds.has(s.id)) err(tag, `duplicate id "${s.id}" (also in ${seenIds.get(s.id)})`);
    seenIds.set(s.id, folder); allIds.add(s.id);
  }

  // Meta
  const m = s.meta;
  if (!m) { err(tag, `missing "meta" block`); }
  else {
    if (!COLLECTIONS.includes(m.collection)) err(tag, `meta.collection must be one of ${COLLECTIONS.join("|")}`);
    if (!STATUSES.includes(m.status)) err(tag, `meta.status must be one of ${STATUSES.join("|")}`);
    if (typeof m.order !== "number") err(tag, `meta.order must be a number`);
    for (const d of ["sourceDate", "reviewedOn", "featuredUntil"]) if (m[d] != null && !isoDate(m[d])) err(tag, `meta.${d} must be YYYY-MM-DD`);
    if (m.status === "featured" && !m.featuredUntil) warn(tag, `featured without meta.featuredUntil (will stay featured until changed by hand)`);
    if (m.collection === "topical" && m.status !== "archived") {
      if (!m.reviewedOn) warn(tag, `topical scenario has no meta.reviewedOn`);
      else {
        const age = (Date.now() - new Date(m.reviewedOn)) / 86400000;
        if (age > STALE_DAYS) warn(tag, `topical scenario last reviewed ${Math.round(age)} days ago (>${STALE_DAYS}); check for stale policy references`);
      }
      if (!m.sources || m.sources.length === 0) warn(tag, `topical scenario lists no meta.sources`);
    }
  }

  // Roles
  const roleIds = s.roles?.length ? s.roles.map(r => r.id) : ["regulator", "platform", "journalist", "ailab"];
  if (s.roles) for (const r of s.roles) for (const k of ["id", "name", "icon", "color", "bg", "role", "incentive"]) if (!r[k]) err(tag, `roles.${r.id || "?"} missing "${k}"`);

  // Intel and options per role
  const optionIds = new Set();
  const optionRole = {};
  for (const r of roleIds) {
    const intel = s.roleIntel?.[r];
    if (!intel) err(tag, `roleIntel.${r} missing`);
    else { if (!intel.classification) err(tag, `roleIntel.${r}.classification missing`); if (!Array.isArray(intel.bullets) || intel.bullets.length < 2) err(tag, `roleIntel.${r}.bullets needs 2+ items`); }
    const opts = s.options?.[r];
    if (!Array.isArray(opts) || opts.length !== 3) { err(tag, `options.${r} must have exactly 3 options`); continue; }
    const stances = opts.map(o => o.stance).sort();
    if (stances.join() !== [...STANCES].sort().join()) err(tag, `options.${r} must have one each of ${STANCES.join("/")} (got ${stances.join(",")})`);
    for (const o of opts) {
      if (!o.id) { err(tag, `options.${r} has an option without id`); continue; }
      if (optionIds.has(o.id)) err(tag, `duplicate option id "${o.id}"`);
      optionIds.add(o.id); optionRole[o.id] = r;
      for (const k of ["label", "detail", "tension"]) if (!o[k]) err(tag, `option ${o.id} missing "${k}"`);
      if (o.tradeoff) warn(tag, `option ${o.id} has legacy "tradeoff" field; runtime reads "tension"`);
      for (const [k, v] of Object.entries(o.scores || {})) {
        if (!METRICS.includes(k)) err(tag, `option ${o.id} has unknown metric "${k}"`);
        if (typeof v !== "number" || Math.abs(v) > 10) err(tag, `option ${o.id}.scores.${k}=${v} out of range (-10..10)`);
      }
    }
  }
  for (const r of Object.keys(s.roleIntel || {})) if (!roleIds.includes(r)) err(tag, `roleIntel.${r} does not match any role`);
  for (const r of Object.keys(s.options || {})) if (!roleIds.includes(r)) err(tag, `options.${r} does not match any role`);

  // Interactions
  if (!Array.isArray(s.interactions) || s.interactions.length < 4) err(tag, `needs at least 4 interactions`);
  const pairKeys = new Set();
  for (const [i, it] of (s.interactions || []).entries()) {
    const t = `interaction[${i}]`;
    if (!Array.isArray(it.pair) || it.pair.length !== 2) { err(tag, `${t} pair must have 2 option ids`); continue; }
    for (const p of it.pair) if (!optionIds.has(p)) err(tag, `${t} references unknown option id "${p}"`);
    if (optionRole[it.pair[0]] && optionRole[it.pair[0]] === optionRole[it.pair[1]]) err(tag, `${t} pairs two options of the same role (${optionRole[it.pair[0]]})`);
    const key = [...it.pair].sort().join("+");
    if (pairKeys.has(key)) err(tag, `${t} duplicates pair ${key}`); pairKeys.add(key);
    if (!["synergy", "conflict"].includes(it.type)) err(tag, `${t} type must be synergy|conflict`);
    for (const k of ["label", "desc"]) if (!it[k]) err(tag, `${t} missing "${k}"`);
    for (const [k, v] of Object.entries(it.mod || {})) {
      if (!METRICS.includes(k)) err(tag, `${t} has unknown metric "${k}"`);
      if (typeof v !== "number" || v < -12 || v > 8) warn(tag, `${t}.mod.${k}=${v} outside usual range (-12..8)`);
    }
  }

  // Translation overlays: every player-facing string in scenario.json must exist in each <lang>.json
  const langs = fs.readdirSync(dir).filter(f => /^[a-z]{2}\.json$/.test(f));
  if (langs.length === 0) err(tag, `no translation overlay (fr.json) found; bilingual guarantee broken`);
  for (const lf of langs) {
    let tr;
    try { tr = JSON.parse(fs.readFileSync(path.join(dir, lf), "utf8")); }
    catch (e) { err(tag, `${lf} is not valid JSON: ${e.message}`); continue; }
    const missing = [];
    const need = (p, ok) => { if (!ok) missing.push(p); };
    for (const k of ["title", "category", "publicBriefing", "stakes"]) need(k, typeof tr[k] === "string" && tr[k].trim());
    if (s.designNote) need("designNote", typeof tr.designNote === "string");
    for (const r of roleIds) {
      need(`roleIntel.${r}.classification`, tr.roleIntel?.[r]?.classification);
      (s.roleIntel?.[r]?.bullets || []).forEach((_, i) => need(`roleIntel.${r}.bullets[${i}]`, tr.roleIntel?.[r]?.bullets?.[i]));
      for (const o of s.options?.[r] || []) for (const k of ["label", "detail", "tension"]) need(`options.${r}.${o.id}.${k}`, tr.options?.[r]?.[o.id]?.[k]);
    }
    (s.interactions || []).forEach((_, i) => { need(`interactions[${i}].label`, tr.interactions?.[i]?.label); need(`interactions[${i}].desc`, tr.interactions?.[i]?.desc); });
    if (missing.length) err(tag, `${lf} is missing ${missing.length} string(s): ${missing.slice(0, 6).join(", ")}${missing.length > 6 ? ", ..." : ""}`);
  }
}

// Cross-scenario checks
for (const folder of folders) {
  const s = JSON.parse(fs.readFileSync(path.join(scenDir, folder, "scenario.json"), "utf8"));
  if (s.meta?.supersededBy && !allIds.has(s.meta.supersededBy)) err(folder, `meta.supersededBy points to unknown scenario "${s.meta.supersededBy}"`);
}

// Legacy layout guard
const flat = fs.readdirSync(scenDir).filter(f => f.endsWith(".json"));
if (flat.length) err("layout", `flat scenario files found (${flat.join(", ")}); run node scripts/migrate-scenarios.mjs`);

console.log(`Validated ${folders.length} scenario(s).`);
for (const w of warnings) console.log(`  warning  ${w}`);
for (const e of errors) console.log(`  ERROR    ${e}`);
if (errors.length || (strict && warnings.length)) { console.log(`\n${errors.length} error(s), ${warnings.length} warning(s). Build blocked.`); process.exit(1); }
console.log(`${warnings.length} warning(s), 0 errors.`);
