// app/components/ProgressLink.tsx
"use client";

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { startNavigationProgress } from './NavigationProgress';

type Props = ComponentProps<typeof Link>;

/**
 * next/link that also kicks off the top progress bar. `onNavigate` only fires for
 * transitions the router actually takes, so modifier-clicks and external targets
 * never leave a stuck bar behind.
 */
export default function ProgressLink({ onNavigate, ...props }: Props) {
  return (
    <Link
      {...props}
      onNavigate={(event) => {
        // The event only exposes preventDefault(), so track cancellation manually
        // rather than reading a defaultPrevented flag that isn't there.
        let cancelled = false;
        onNavigate?.({
          ...event,
          preventDefault: () => {
            cancelled = true;
            event.preventDefault();
          },
        });
        if (!cancelled) startNavigationProgress();
      }}
    />
  );
}
