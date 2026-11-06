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
 * Safe PageView triggers (handled exclusively and once on site load in RootShell)
 */
export function trackPageView(_pageName?: string) {
  // Handled exactly once upon entering the funnel
}

export function triggerFirstCtaPageView() {
  // Safe no-op to prevent duplicate PageView events across the funnel
}

/**
 * Send Conversions API (CAPI) event to Meta Graph API with deduplication event_id
 */
async function sendMetaCapiEvent(
  eventName: string,
  customData?: Record<string, any>,
  eventId?: string
) {
  if (typeof window === "undefined") return;

  try {
    const eventTime = Math.floor(Date.now() / 1000);
    const finalEventId =
      eventId || "evt_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime,
          event_id: finalEventId,
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
 * Track ViewContent event (strictly once per session on the Offer page)
 */
export function trackViewContent(contentName: string = "Faith Offer Page", value: number = 47) {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    // Avoid duplicate triggers in React re-renders or page re-visits in same session
    if (sessionStorage.getItem("faith_viewcontent_tracked") === "1") return;
    sessionStorage.setItem("faith_viewcontent_tracked", "1");

    const eventId = "vc_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
    const eventData = {
      content_name: contentName,
      content_category: "Divine Script & Blueprint",
      value: value,
      currency: "USD",
    };

    window.fbq("track", "ViewContent", eventData, { eventID: eventId });
    sendMetaCapiEvent("ViewContent", eventData, eventId);
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
    const eventId = "ic_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
    const eventData = {
      content_name: `Seed of Faith - ${productKey}`,
      content_category: "Spiritual Blueprint",
      value: price,
      currency: "USD",
      num_items: 1,
    };

    window.fbq("track", "InitiateCheckout", eventData, { eventID: eventId });
    sendMetaCapiEvent("InitiateCheckout", eventData, eventId);
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
    sessionStorage.setItem("faith_purchase_tracked", "1");

    const eventId = "pur_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
    const eventData = {
      value: value,
      currency: currency,
      content_name: "Seed of Faith Full Package",
      content_type: "product",
    };

    window.fbq("track", "Purchase", eventData, { eventID: eventId });
    sendMetaCapiEvent("Purchase", eventData, eventId);
  } catch (err) {
    console.debug("Track Purchase error:", err);
  }
}
