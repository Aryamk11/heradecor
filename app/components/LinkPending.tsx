// app/components/LinkPending.tsx
"use client";

import { useLinkStatus } from 'next/link';

/**
 * Renders inside a <Link> and shows a spinner while that specific link's
 * navigation is pending — so the tab you clicked is the one that reacts.
 */
export default function LinkPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return (
    <span className="link-spinner spinner-border spinner-border-sm ms-2" role="status">
      <span className="visually-hidden">در حال بارگذاری</span>
    </span>
  );
}
