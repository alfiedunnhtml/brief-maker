"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefGeneratorButton } from "./brief-generator-button";
import { supabase, type Brief } from "@/lib/supabase";
import { Spinner } from "@/components/ui/spinner";
import { LikeButton } from "@/components/ui/like-button";
import { BriefCard } from "./brief-card";

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
            company_name: brief.company_name,
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
          <BriefCard key={brief.id} brief={brief} />
        ))}
      </section>
    </div>
  );
} 