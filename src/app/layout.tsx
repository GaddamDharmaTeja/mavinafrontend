import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Mavinamane | Farm-fresh mangoes",
  description: "Mangoes from trusted orchards",
  icons: { icon: "/maviina-icon.svg", shortcut: "/maviina-icon.svg", apple: "/maviina-icon.svg" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body suppressHydrationWarning>{children}</body></html>; }
