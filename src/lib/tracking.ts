declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    pixelId?: string;
  }
}

export const META_PIXEL_ID = "29015918781408333";

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
 * Track PageView event
 */
export function trackPageView(pageName?: string) {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("track", "PageView", pageName ? { page_name: pageName } : undefined);
  } catch (err) {
    console.debug("Track PageView error:", err);
  }
}

/**
 * Track ViewContent event (e.g. when landing on the Offer page)
 */
export function trackViewContent(contentName: string, value?: number) {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("track", "ViewContent", {
      content_name: contentName,
      content_category: "Divine Script & Blueprint",
      ...(value ? { value, currency: "USD" } : {}),
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
    const alreadyTracked = sessionStorage.getItem("faith_purchase_tracked");
    if (alreadyTracked === "1") return;

    window.fbq("track", "Purchase", {
      value: value,
      currency: currency,
      content_name: "Seed of Faith Full Package",
      content_type: "product",
    });

    sessionStorage.setItem("faith_purchase_tracked", "1");
  } catch (err) {
    console.debug("Track Purchase error:", err);
  }
}
