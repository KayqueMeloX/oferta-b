import { appendUtms } from "../lib/tracking";

/**
 * Direct Stripe payment / checkout URLs for each plan.
 */
export const PAYMENT_LINKS: Record<string, string> = {
  // $27 - Seed of Faith
  "seed-27": "https://buy.stripe.com/28EdR99ibdEj1RVfl8ao803",

  // $47 - Roots of Faith (Most Popular)
  "seed-47": "https://buy.stripe.com/aFa5kD9ibgQveEH0qeao804",

  // $77 - Harvest of Faith (Best Value)
  "seed-77": "https://buy.stripe.com/9B6cN565Z43JeEH6OCao805",

  // $100 - Legacy of Faith (Complete)
  "seed-100": "https://buy.stripe.com/28EaEX51V7fVfILb4Sao806",
};

/**
 * Returns the direct payment URL for a given plan key (e.g. 'seed-27' or '27').
 * Preserves all UTM campaign parameters and redirects directly to Stripe.
 */
export function getPaymentUrl(planKey: string): string {
  const normalizedKey = planKey.startsWith("seed-") ? planKey : `seed-${planKey}`;
  const directLink = PAYMENT_LINKS[normalizedKey];

  if (directLink && !directLink.includes("CONFIGURE_SEU_LINK_AQUI")) {
    return appendUtms(directLink);
  }

  const num = normalizedKey.replace("seed-", "");
  return appendUtms(`/checkout?plan=${num}`);
}
