"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

type TrackLinkProps = ComponentProps<typeof Link> & {
  eventName: string;
  eventParams?: Record<string, string | number | boolean | null | undefined>;
};

export function TrackLink({ eventName, eventParams, onClick, ...props }: TrackLinkProps) {
  const router = useRouter();

  return (
    <Link
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventParams);
        onClick?.(event);

        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          typeof props.href !== "string" ||
          props.href.startsWith("http") ||
          props.href.startsWith("mailto:")
        ) {
          return;
        }

        event.preventDefault();
        window.setTimeout(() => {
          router.push(props.href as string);
        }, 150);
      }}
    />
  );
}
