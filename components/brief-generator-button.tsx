"use client";

/**
 * BriefGeneratorButton Component
 * 
 * A button component that generates new briefs using the OpenAI API.
 * It handles the entire generation process including:
 * - Making the API request
 * - Parsing the response
 * - Extracting metadata (industry, difficulty, colors, etc.)
 * - Creating a structured Brief object
 * 
 * Features:
 * - Loading state with spinner
 * - Error handling and display
 * - Parses complex AI response into structured data
 * - Callback with generated brief data
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { type Brief } from "@/lib/supabase";
import { Sparkles } from "lucide-react";

interface ApiResponse {
  content: string;    // Raw response from the OpenAI API
  error?: string;     // Optional error message
}

interface BriefGeneratorButtonProps {
  onBriefGenerated: (brief: Brief) => void;  // Callback when brief is generated
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
      const difficulty = difficultyLine ? difficultyLine.split(":")[1].trim() : "N/A";
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
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
        onClick={generateBrief}
        disabled={isLoading}
      >

        {isLoading ? (
          <>
            <Spinner className="mr-2" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Brief
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 