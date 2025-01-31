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

      // Parse the response to extract industry, difficulty, and company name
      const lines: string[] = data.content.split("\n");
      const industryLine = lines.find((line: string) => line.startsWith("INDUSTRY:"));
      const difficultyLine = lines.find((line: string) => line.startsWith("DIFFICULTY:"));
      const companyLine = lines.find((line: string) => line.startsWith("COMPANY NAME:"));

      const industry = industryLine ? industryLine.split(":")[1].trim() : "Unknown";
      const difficulty = difficultyLine ? difficultyLine.split(":")[1].trim() : "Medium";
      const company_name = companyLine ? companyLine.split(":")[1].trim() : "Untitled Company";

      // Remove the metadata lines from the content
      const content = lines
        .filter((line: string) => !line.startsWith("INDUSTRY:") && !line.startsWith("DIFFICULTY:") && !line.startsWith("COMPANY NAME:"))
        .join("\n")
        .trim();

      const newBrief: Brief = {
        id: Date.now().toString(),
        content,
        industry,
        difficulty,
        company_name,
        created_at: new Date(),
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
    <div className="flex flex-col items-center gap-4">
      <Button
        size="lg"
        className="font-semibold"
        onClick={generateBrief}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2" />
            Generating...
          </>
        ) : (
          "Generate New Brief"
        )}
      </Button>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 