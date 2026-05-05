export const FREE_TEMPLATE_IDS = ["professional-blue", "minimal-clean", "ats-classic"] as const;

export function isFreeTemplate(templateId: string) {
  return FREE_TEMPLATE_IDS.includes(templateId as (typeof FREE_TEMPLATE_IDS)[number]);
}
