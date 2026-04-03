import type { Metadata } from "next";
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
        {children}
      </body>
    </html>
  );
}
