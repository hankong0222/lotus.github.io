import type { Metadata } from "next";
import HandPainter from "@/components/HandPainter";
import ParticleField from "@/components/ParticleField";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lotus Portfolio",
  description: "A research-forward portfolio with projects, ideas, and essays.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ParticleField />
        <HandPainter />
        <div id="app-scroll-root" className="app-scroll-root">
          {children}
        </div>
      </body>
    </html>
  );
}
