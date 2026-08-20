"use client";

import dynamic from "next/dynamic";

const LegacyMavinamaneApp = dynamic(() => import("../App"), { ssr: false });

// Preserve the original Mavinamane visual design inside the new Next.js shell.
export default function SpaApp() {
  return <LegacyMavinamaneApp />;
}
