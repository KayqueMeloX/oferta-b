declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    pixelId?: string;
    _fb_first_cta_tracked?: boolean;
  }
}

export const META_PIXEL_ID = "29015918781408333";
export const META_ACCESS_TOKEN =
  "EAAMZCDQyWTsoBS0lOprTadaefyCh46gfXMyl1tl5zW1RGqXH2ynA307fi0YMUFVnSVOEAWZCZCZBIHmzfbQZAaZB1tBQjZCAWSaFaP55dZCJGNmlFfZCNhRKBM5WPB173J9aeZCWp51hHbjwLTF1mC9LOo9AVMoUirMQ5atNjLaRAmi50ZC2ubfPm3ZAgFUEN62qJwZDZD";

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
 * Track PageView event cleanly - strictly once per unique route
 */
const trackedRoutesInSession = new Set<string>();

export function trackPageView(pageName?: string) {
  if (typeof window === "undefined" || !window.fbq) return;

  const currentPath = pageName || window.location.pathname;
  const normalized = currentPath.replace(/\/+$/, "") || "/";

  // Prevent duplicate firing on the same route in a session
  if (trackedRoutesInSession.has(normalized)) return;
  trackedRoutesInSession.add(normalized);

  // Initial landing page view is already dispatched by <head>
  if (normalized === "/" || normalized === "/quiz") return;

  try {
    window.fbq("track", "PageView");
  } catch (err) {
    console.debug("[Pixel] fbq track error:", err);
  }

  sendMetaCapiEvent("PageView");
}

export function triggerFirstCtaPageView() {
  trackPageView();
}

/**
 * Send Conversions API (CAPI) event to Meta Graph API
 */
async function sendMetaCapiEvent(eventName: string, customData?: Record<string, any>) {
  if (typeof window === "undefined") return;

  try {
    const eventTime = Math.floor(Date.now() / 1000);
    const eventId = "evt_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime,
          event_id: eventId,
          event_source_url: window.location.href,
          action_source: "website",
          user_data: {
            client_user_agent: navigator.userAgent,
          },
          ...(customData ? { custom_data: customData } : {}),
        },
      ],
      access_token: META_ACCESS_TOKEN,
    };

    const endpoint = `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events`;
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "no-cors",
        keepalive: true,
      }).catch(() => {});
    }
  } catch (err) {
    console.debug("[CAPI] error:", err);
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
    sendMetaCapiEvent("ViewContent", { content_name: contentName, ...(value ? { value, currency: "USD" } : {}) });
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
    sendMetaCapiEvent("InitiateCheckout", {
      content_name: `Seed of Faith - ${productKey}`,
      value: price,
      currency: "USD",
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
    sendMetaCapiEvent("Purchase", { value, currency });

    sessionStorage.setItem("faith_purchase_tracked", "1");
  } catch (err) {
    console.debug("Track Purchase error:", err);
  }
}
