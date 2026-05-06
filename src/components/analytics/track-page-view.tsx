"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

type TrackPageViewProps = {
  eventName: string;
  eventParams?: Record<string, string | number | boolean | null | undefined>;
  delayMs?: number;
};

export function TrackPageView({ eventName, eventParams, delayMs = 1500 }: TrackPageViewProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      trackEvent(eventName, eventParams);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delayMs, eventName, eventParams]);

  return null;
}
