// app/components/NavigationProgress.tsx
"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const START_EVENT = 'hera:navigation-start';

/** Called by ProgressLink when a navigation is committed. */
export function startNavigationProgress() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(START_EVENT));
  }
}

/**
 * Thin bar across the top of the viewport while a route transition is in flight.
 * It creeps toward 90% rather than tracking real progress — the actual work is a
 * server round-trip we get no increments from — then snaps to 100% and fades out
 * once the new pathname/search params have rendered.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onStart = () => {
      setVisible(true);
      setProgress(10);
    };
    window.addEventListener(START_EVENT, onStart);
    return () => window.removeEventListener(START_EVENT, onStart);
  }, []);

  // Creep upward while visible and not yet finished.
  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.max(1, (90 - p) / 8)));
    }, 180);
    return () => clearInterval(timer);
  }, [visible]);

  // The route has changed, so the transition is done.
  useEffect(() => {
    if (!visible) return;
    setProgress(100);
    const hide = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 320);
    return () => clearTimeout(hide);
    // Deliberately keyed on the destination, not on `visible`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div className="nav-progress" role="progressbar" aria-label="در حال بارگذاری صفحه" aria-hidden="true">
      <div
        className="nav-progress__bar"
        style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
      />
    </div>
  );
}
