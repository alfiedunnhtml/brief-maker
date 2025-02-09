"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { type Brief } from "@/lib/supabase";

interface ApiResponse {
  content: string;
  error?: string;
}

interface BriefGeneratorButtonProps {
  onBriefGenerated: (brief: Brief) => void;
}

export function BriefGeneratorButton({ onBriefGenerated }: BriefGeneratorButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateBrief = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-brief", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate brief");
      }

      const data: ApiResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Parse the response to extract metadata
      const lines: string[] = data.content.split("\n");
      const industryLine = lines.find((line: string) => line.startsWith("INDUSTRY:"));
      const difficultyLine = lines.find((line: string) => line.startsWith("DIFFICULTY:"));
      const companyLine = lines.find((line: string) => line.startsWith("COMPANY NAME:"));
      const colorsLine = lines.find((line: string) => line.startsWith("COLORS:"));
      const styleLine = lines.find((line: string) => line.startsWith("WEBSITE STYLE:"));

      // Extract deliverables section
      const deliverablesStartIndex = lines.findIndex(line => line.startsWith("DELIVERABLES:"));
      let deliverables: string[] = [];
      
      if (deliverablesStartIndex !== -1) {
        // Get the line after "DELIVERABLES:" and split by commas
        const deliverablesLine = lines[deliverablesStartIndex].split("DELIVERABLES:")[1];
        if (deliverablesLine) {
          deliverables = deliverablesLine
            .split(",")
            .map(item => item.trim())
            .filter(Boolean); // Remove empty strings
        }
      }

      const industry = industryLine ? industryLine.split(":")[1].trim() : "Unknown";
      const difficulty = difficultyLine ? difficultyLine.split(":")[1].trim() : "Medium";
      const company_name = companyLine ? companyLine.split(":")[1].trim() : "Untitled Company";
      const brand_colors = colorsLine 
        ? colorsLine.split(":")[1]
            .trim()
            .match(/#[0-9A-Fa-f]{6}/g) || []
        : [];
      const style = styleLine ? styleLine.split(":")[1].trim() : "";

      // Remove the metadata lines and deliverables section from the content
      const content = lines
        .filter((line: string) => 
          !line.startsWith("INDUSTRY:") && 
          !line.startsWith("DIFFICULTY:") && 
          !line.startsWith("COMPANY NAME:") &&
          !line.startsWith("COLORS:") &&
          !line.startsWith("WEBSITE STYLE:") &&
          !line.startsWith("DELIVERABLES:")
        )
        .join("\n")
        .trim();

      const newBrief: Brief = {
        id: Date.now(),
        content,
        industry,
        difficulty,
        company_name,
        created_at: new Date().toISOString(),
        brand_colors,
        style,
        deliverables,
      };

      onBriefGenerated(newBrief);
    } catch (error) {
      console.error("Error generating brief:", error);
      setError(error instanceof Error ? error.message : "Failed to generate brief. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <Button
        size="lg"
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
        onClick={generateBrief}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2" />
            Generating...
          </>
        ) : (
          "Generate Brief"
        )}
      </Button>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 