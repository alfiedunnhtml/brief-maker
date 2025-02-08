"use client";

import { BriefGeneratorButton } from "./brief-generator-button";
import { type Brief } from "@/lib/supabase";

interface BriefGeneratorSectionProps {
  onBriefGenerated: (brief: Brief) => void;
}

export function BriefGeneratorSection({ onBriefGenerated }: BriefGeneratorSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Web Design Brief Generator</h2>
        <p className="text-muted-foreground">Generate creative web design briefs instantly</p>
      </div>

      <div className="space-y-4">
        <BriefGeneratorButton onBriefGenerated={onBriefGenerated} />

        <div className="pt-4">
          <p className="text-sm text-muted-foreground">
            Generate longer, more detailed briefs by upgrading to Pro
          </p>
        </div>
      </div>
    </div>
  );
} 