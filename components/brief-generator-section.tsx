"use client";

import { BriefGeneratorButton } from "./brief-generator-button";
import { type Brief } from "@/lib/supabase";

interface BriefGeneratorSectionProps {
  onBriefGenerated: (brief: Brief) => void;
}

export function BriefGeneratorSection({ onBriefGenerated }: BriefGeneratorSectionProps) {
  return (
    <section className="mb-12 text-center">
      <h2 className="mb-4 text-4xl font-bold">Generate Web Design Briefs</h2>
      <p className="mb-8 text-muted-foreground">
        Click the button below to generate a random web design brief from a simulated client
      </p>
      <BriefGeneratorButton onBriefGenerated={onBriefGenerated} />
    </section>
  );
} 