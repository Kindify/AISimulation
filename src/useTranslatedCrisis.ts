import { useTranslation } from 'react-i18next';

export function useTranslatedCrisis(crisis: any) {
  const { t } = useTranslation();
  if (!crisis) return crisis;
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
