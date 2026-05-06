type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: AnalyticsEventParams) => void;
    dataLayer?: unknown[];
  }
}

function ensureGtagFallback() {
  window.dataLayer = window.dataLayer || [];

  if (!window.gtag) {
    window.gtag = function gtagFallback(command, eventName, params) {
      window.dataLayer?.push(arguments);
    };
  }

  return window.gtag;
}

export function trackEvent(eventName: string, params?: AnalyticsEventParams) {
  if (typeof window === "undefined") return;

  const eventParams = {
    transport_type: "beacon",
    ...params,
  };

  ensureGtagFallback()("event", eventName, eventParams);
}
