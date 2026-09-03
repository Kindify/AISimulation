import { useT } from './useT';
import type { Scenario } from './scenarios/types';

/**
 * Returns a copy of the scenario with every player-facing string replaced by
 * its translation when one exists (keys: scenarios.<id>.*). English values in
 * scenario.json are the fallback, so a missing key never renders blank.
 */
export function useTranslatedCrisis(crisis: Scenario | null | undefined): Scenario {
  const { t } = useT();
  if (!crisis) return crisis as unknown as Scenario;
  const id = crisis.id;
  const s = (path: string, fallback: string) => t(`scenarios.${id}.${path}`, fallback);

  return {
    ...crisis,
    title: s('title', crisis.title),
    category: s('category', crisis.category),
    publicBriefing: s('publicBriefing', crisis.publicBriefing),
    stakes: s('stakes', crisis.stakes),
    designNote: s('designNote', crisis.designNote || ''),
    roleIntel: Object.fromEntries(
      Object.entries(crisis.roleIntel || {}).map(([roleId, intel]: [string, any]) => [
        roleId,
        {
          ...intel,
          classification: s(`roleIntel.${roleId}.classification`, intel.classification),
          bullets: (intel.bullets || []).map((b: string, i: number) =>
            s(`roleIntel.${roleId}.bullets.${i}`, b)
          )
        }
      ])
    ),
    options: Object.fromEntries(
      Object.entries(crisis.options || {}).map(([roleId, opts]: [string, any]) => [
        roleId,
        opts.map((opt: any) => ({
          ...opt,
          label: s(`options.${roleId}.${opt.id}.label`, opt.label),
          detail: s(`options.${roleId}.${opt.id}.detail`, opt.detail),
          tension: s(`options.${roleId}.${opt.id}.tension`, opt.tension || opt.detail)
        }))
      ])
    ),
    interactions: (crisis.interactions || []).map((inter: any, i: number) => ({
      ...inter,
      label: s(`interactions.${i}.label`, inter.label),
      desc: s(`interactions.${i}.desc`, inter.desc)
    }))
  };
}
