"use client";

import { BriefGeneratorButton } from "./brief-generator-button";
import { type Brief } from "@/lib/supabase";
import { Sparkles } from "lucide-react";

interface BriefGeneratorSectionProps {
  onBriefGenerated: (brief: Brief) => void;
}

export function BriefGeneratorSection({ onBriefGenerated }: BriefGeneratorSectionProps) {
  return (
    <div className="h-72 flex flex-col">
      <div>
        <h2 className="text-2xl font-bold">Web Design Brief Generator</h2>
        <p className="text-muted-foreground">Generate creative web design briefs instantly</p>
      </div>

      <div className="space-y-4 mt-6">
        <BriefGeneratorButton onBriefGenerated={onBriefGenerated} />
      </div>

      <div className="flex-1 box-border mt-6 rounded-lg bg-gradient-to-b from-yellow-50 to-yellow-100 p-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <Sparkles className="h-4 w-4" />
          <h3 className="font-semibold">Upgrade to Pro</h3>
        </div>
        <p className="mt-2 text-sm text-yellow-800">
          Get access to longer, more detailed briefs with brand colors, style preferences, and more customization options.
        </p>
      </div>
    </div>
  );
} 