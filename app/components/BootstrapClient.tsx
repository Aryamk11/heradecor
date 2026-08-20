// app/components/BootstrapClient.tsx
"use client";

import { useEffect } from 'react';

/**
 * Loads Bootstrap's JS bundle from the installed dependency instead of a CDN.
 * Its data-api wires up [data-bs-toggle] dropdowns and collapses on its own,
 * so no manual getOrCreateInstance() pass is needed.
 */
export default function BootstrapClient() {
  useEffect(() => {
    // The package entry point is typed by @types/bootstrap and pulls in Popper
    // itself, unlike the untyped prebuilt bundle file.
    import('bootstrap');
  }, []);

  return null;
}
