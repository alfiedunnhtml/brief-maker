"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LikeButton } from "@/components/ui/like-button";
import { Spinner } from "@/components/ui/spinner";
import { supabase, type Brief } from "@/lib/supabase";
import { MainLayout } from "@/components/main-layout";

export default function BriefPage() {
  const params = useParams();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBrief() {
      try {
        const { data, error } = await supabase
          .from('briefs')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          return;
        }

        setBrief(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch brief');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBrief();
  }, [params.id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <Spinner className="mb-4 h-8 w-8" />
            <div className="text-muted-foreground">Loading brief...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !brief) {
    return (
      <MainLayout>
        <div className="text-center text-red-500">
          {error || "Brief not found"}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl">{brief.company_name || "Web Design Brief"}</CardTitle>
              <LikeButton briefId={brief.id.toString()} />
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1.5 text-sm text-blue-800">
                {brief.industry}
              </span>
              <span 
                className={`rounded-full px-3 py-1.5 text-sm ${
                  brief.difficulty === "Easy"
                    ? "bg-green-100 text-green-800"
                    : brief.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {brief.difficulty}
              </span>
            </div>
          </div>
          <CardDescription>
            Generated on {new Date(brief.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed whitespace-pre-wrap">
            {brief.content}
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
} 