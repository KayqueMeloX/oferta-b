/**
 * Direct payment / checkout URLs for each plan.
 * Replace the placeholder links below with your Kiwify, Hotmart, Stripe, Cartpanda or PerfectPay checkout URLs.
 */
export const PAYMENT_LINKS: Record<string, string> = {
  // $27 - Seed of Faith
  "seed-27": "https://CONFIGURE_SEU_LINK_AQUI/plan-27",

  // $47 - Roots of Faith (Most Popular)
  "seed-47": "https://CONFIGURE_SEU_LINK_AQUI/plan-47",

  // $77 - Harvest of Faith (Best Value)
  "seed-77": "https://CONFIGURE_SEU_LINK_AQUI/plan-77",

  // $100 - Legacy of Faith (Complete)
  "seed-100": "https://CONFIGURE_SEU_LINK_AQUI/plan-100",
};

/**
 * Returns the direct payment URL for a given plan key (e.g. 'seed-27' or '27').
 * If the link is configured, redirects directly to the external payment processor.
 * If not yet configured, falls back to the internal /checkout page for preview.
 */
export function getPaymentUrl(planKey: string): string {
  const normalizedKey = planKey.startsWith("seed-") ? planKey : `seed-${planKey}`;
  const directLink = PAYMENT_LINKS[normalizedKey];

  if (directLink && !directLink.includes("CONFIGURE_SEU_LINK_AQUI")) {
    return directLink;
  }

  const num = normalizedKey.replace("seed-", "");
  return `/checkout?plan=${num}`;
}
