import type { Metadata } from "next";
import "@fontsource-variable/montserrat";
import "@fontsource-variable/josefin-sans";
import "@fontsource-variable/mulish";
import "@fontsource/allura";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scierie R. Sourgens — Uza, Landes | Savoir-faire familial depuis 1928",
  description:
    "Scierie familiale à Uza, au cœur des Landes : bois de construction, terrasses, bardages, parquets, bois sur mesure et produits en pin des Landes depuis 1928.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
