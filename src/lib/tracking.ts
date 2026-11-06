declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    pixelId?: string;
  }
}

export const META_PIXEL_ID = "1127341919934737";
export const META_ACCESS_TOKEN =
  "EAAMZCDQyWTsoBS1GaQ2wKAEJpPKW57nApuZCoIuCs8gPIOyFEkyIgjP6jdNdtgFKoU1sZBY7ZBpVmjHzc7qPClaOWIlz0WGbV1nKu5622qdMubvS2OHYichqcR23D8oOgLNxWZBhRhkNJW64OjmJFttF49rW65yYnltE6nYEx9S0qbPgNBX4t4LNY08SRpgZDZD";

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "src",
  "sck",
  "fbclid",
  "gclid",
];

/**
 * Initialize tracking on client mount
 */
export function initTracking() {
  if (typeof window === "undefined") return;
  captureAndStoreUtms();
}

/**
 * Capture and store any UTM or tracking parameters from the current URL
 */
export function captureAndStoreUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const searchParams = new URLSearchParams(window.location.search);
  const stored: Record<string, string> = {};

  try {
    const existing = JSON.parse(localStorage.getItem("faith_tracking_utms") || "{}");
    Object.assign(stored, existing);
  } catch {}

  UTM_PARAMS.forEach((param) => {
    const val = searchParams.get(param);
    if (val) {
      stored[param] = val;
    }
  });

  try {
    if (Object.keys(stored).length > 0) {
      localStorage.setItem("faith_tracking_utms", JSON.stringify(stored));
    }
  } catch {}

  return stored;
}

/**
 * Append preserved UTM parameters to any outbound URL (e.g. Stripe checkout)
 */
export function appendUtms(targetUrl: string): string {
  if (typeof window === "undefined") return targetUrl;

  try {
    const storedUtms = JSON.parse(localStorage.getItem("faith_tracking_utms") || "{}");
    const url = new URL(targetUrl, window.location.origin);

    Object.entries(storedUtms).forEach(([key, value]) => {
      if (typeof value === "string" && !url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    });

    return url.toString();
  } catch {
    return targetUrl;
  }
}

/**
 * Track PageView is handled cleanly and strictly once in <head>
 */
export function trackPageView(_pageName?: string) {}

export function triggerFirstCtaPageView() {}

/**
 * Track ViewContent event (strictly once per session on the Offer page)
 */
export function trackViewContent(contentName: string = "Faith Offer Page", value: number = 47) {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    if (sessionStorage.getItem("faith_viewcontent_tracked") === "1") return;
    sessionStorage.setItem("faith_viewcontent_tracked", "1");

    window.fbq("track", "ViewContent", {
      content_name: contentName,
      content_category: "Divine Script & Blueprint",
      value: value,
      currency: "USD",
    });
  } catch (err) {
    console.debug("Track ViewContent error:", err);
  }
}

/**
 * Track InitiateCheckout event (when user clicks any Seed button)
 */
export function trackInitiateCheckout(productKey: string, price: number) {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("track", "InitiateCheckout", {
      content_name: `Seed of Faith - ${productKey}`,
      content_category: "Spiritual Blueprint",
      value: price,
      currency: "USD",
      num_items: 1,
    });
  } catch (err) {
    console.debug("Track InitiateCheckout error:", err);
  }
}

/**
 * Track Purchase event (when returning from Stripe to /faith-app?success=true)
 */
export function trackPurchase(value: number = 47, currency: string = "USD") {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    if (sessionStorage.getItem("faith_purchase_tracked") === "1") return;
    sessionStorage.setItem("faith_purchase_tracked", "1");

    window.fbq("track", "Purchase", {
      value: value,
      currency: currency,
      content_name: "Seed of Faith Full Package",
      content_type: "product",
    });
  } catch (err) {
    console.debug("Track Purchase error:", err);
  }
}
