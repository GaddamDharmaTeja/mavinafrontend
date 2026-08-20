import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Mavinamane | Farm-fresh mangoes", description: "Mangoes from trusted orchards" };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body suppressHydrationWarning>{children}</body></html>; }
