"use client";

import { usePathname } from "next/navigation";
import HandPainter from "@/components/HandPainter";
import ParticleField from "@/components/ParticleField";

export default function RouteEffects() {
  const pathname = usePathname();
  const isIdeaDetail = pathname.startsWith("/ideas/");

  return (
    <>
      {isIdeaDetail ? null : <ParticleField />}
      <HandPainter />
    </>
  );
}
