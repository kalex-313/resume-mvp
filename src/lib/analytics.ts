import { track as trackVercelEvent } from "@vercel/analytics";

type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;
type StorageParams = Record<string, string>;

const SESSION_KEYS = {
  signupSource: "rolearc_signup_source",
  upgradeSource: "rolearc_upgrade_source",
  utmSource: "rolearc_utm_source",
  utmMedium: "rolearc_utm_medium",
  utmCampaign: "rolearc_utm_campaign",
  utmTerm: "rolearc_utm_term",
  utmContent: "rolearc_utm_content",
};

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

function safeSessionStorage() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function persistParam(storage: Storage | null, key: string, value: string | null) {
  if (!storage || !value) return;
  storage.setItem(key, value);
}

function getStoredParams(storage: Storage | null): StorageParams {
  if (!storage) return {};

  return {
    signup_source: storage.getItem(SESSION_KEYS.signupSource) || "",
    upgrade_source: storage.getItem(SESSION_KEYS.upgradeSource) || "",
    utm_source: storage.getItem(SESSION_KEYS.utmSource) || "",
    utm_medium: storage.getItem(SESSION_KEYS.utmMedium) || "",
    utm_campaign: storage.getItem(SESSION_KEYS.utmCampaign) || "",
    utm_term: storage.getItem(SESSION_KEYS.utmTerm) || "",
    utm_content: storage.getItem(SESSION_KEYS.utmContent) || "",
  };
}

function getReferrerDomain() {
  if (!document.referrer) return "";

  try {
    return new URL(document.referrer).hostname;
  } catch {
    return "";
  }
}

function enrichEventParams(
  eventName: string,
  params?: AnalyticsEventParams
): AnalyticsEventParams {
  const storage = safeSessionStorage();
  const searchParams = new URLSearchParams(window.location.search);

  persistParam(storage, SESSION_KEYS.utmSource, searchParams.get("utm_source"));
  persistParam(storage, SESSION_KEYS.utmMedium, searchParams.get("utm_medium"));
  persistParam(storage, SESSION_KEYS.utmCampaign, searchParams.get("utm_campaign"));
  persistParam(storage, SESSION_KEYS.utmTerm, searchParams.get("utm_term"));
  persistParam(storage, SESSION_KEYS.utmContent, searchParams.get("utm_content"));

  const source = typeof params?.source === "string" ? params.source : "";

  if (eventName === "sign_up_click" && source) {
    persistParam(storage, SESSION_KEYS.signupSource, source);
  }

  if (eventName === "upgrade_click" && source) {
    persistParam(storage, SESSION_KEYS.upgradeSource, source);
  }

  return {
    page_path: window.location.pathname,
    page_title: document.title,
    referrer_domain: getReferrerDomain(),
    ...getStoredParams(storage),
    ...params,
  };
}

export function trackEvent(eventName: string, params?: AnalyticsEventParams) {
  if (typeof window === "undefined") return;

  const eventParams = {
    transport_type: "beacon",
    ...enrichEventParams(eventName, params),
  };

  ensureGtagFallback()("event", eventName, eventParams);
  trackVercelEvent(eventName, eventParams);
}
