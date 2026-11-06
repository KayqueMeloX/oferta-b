declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    pixelId?: string;
  }
}

export const META_PIXEL_ID = "";
export const META_ACCESS_TOKEN = "";

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
 * Event Tracking Stubs (Pixel removed from site)
 */
export function trackPageView(_pageName?: string) {}

export function triggerFirstCtaPageView() {}

export function trackViewContent(_contentName?: string, _value?: number) {}

export function trackInitiateCheckout(_productKey?: string, _price?: number) {}

export function trackPurchase(_value?: number, _currency?: string) {}
