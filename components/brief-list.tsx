"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefGeneratorButton } from "./brief-generator-button";
import { supabase, type Brief } from "@/lib/supabase";
import { Spinner } from "@/components/ui/spinner";

export function BriefList() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch briefs on component mount
  useEffect(() => {
    async function fetchBriefs() {
      try {
        console.log('Fetching briefs...');
        const { data, error } = await supabase
          .from('briefs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          return;
        }

        console.log('Fetched briefs:', data);
        setBriefs(data || []);
      } catch (error) {
        console.error('Error fetching briefs:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch briefs');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBriefs();
  }, []);

  const handleBriefGenerated = async (brief: Brief) => {
    try {
      console.log('Saving brief:', brief);
      // Insert the new brief into Supabase
      const { data, error } = await supabase
        .from('briefs')
        .insert([
          {
            id: brief.id,
            content: brief.content,
            industry: brief.industry,
            difficulty: brief.difficulty,
            created_at: brief.created_at,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Saved brief:', data);
      // Update local state with the new brief
      setBriefs((prev) => [data, ...prev]);
    } catch (error) {
      console.error('Error saving brief:', error);
      setError(error instanceof Error ? error.message : 'Failed to save brief');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <Spinner className="mb-4 h-8 w-8" />
          <div className="text-muted-foreground">Loading your briefs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-500 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold">Generate Web Design Briefs</h2>
        <p className="mb-8 text-muted-foreground">
          Click the button below to generate a random web design brief from a simulated client
        </p>
        <BriefGeneratorButton onBriefGenerated={handleBriefGenerated} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {briefs.map((brief) => (
          <Card key={brief.id} className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>Web Design Brief</CardTitle>
                <div className="flex gap-2">
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    {brief.industry}
                  </span>
                  <span 
                    className={`rounded-full px-2 py-1 text-xs ${
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
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {brief.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
} 