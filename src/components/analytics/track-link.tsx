"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

type TrackLinkProps = ComponentProps<typeof Link> & {
  eventName: string;
  eventParams?: Record<string, string | number | boolean | null | undefined>;
};

export function TrackLink({ eventName, eventParams, onClick, ...props }: TrackLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventParams);
        onClick?.(event);
      }}
    />
  );
}
