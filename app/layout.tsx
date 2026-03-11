import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mapa Ostrowa Wielkopolskiego",
  description: "Interaktywna mapa miasta Ostrów Wielkopolski",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
