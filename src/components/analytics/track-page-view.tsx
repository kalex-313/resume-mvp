"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

type TrackPageViewProps = {
  eventName: string;
  eventParams?: Record<string, string | number | boolean | null | undefined>;
};

export function TrackPageView({ eventName, eventParams }: TrackPageViewProps) {
  useEffect(() => {
    trackEvent(eventName, eventParams);
  }, [eventName, eventParams]);

  return null;
}
