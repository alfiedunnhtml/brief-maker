"use client";

import { useEffect, useState } from "react";
import { supabase, type Brief } from "@/lib/supabase";
import { Spinner } from "@/components/ui/spinner";
import { BriefCard } from "./brief-card";

interface BriefListProps {
  briefs?: Brief[];
  setBriefs?: React.Dispatch<React.SetStateAction<Brief[]>>;
  showTitle?: boolean;
}

export function BriefList({ briefs: initialBriefs, setBriefs, showTitle = false }: BriefListProps) {
  const [localBriefs, setLocalBriefs] = useState<Brief[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBriefs() {
      try {
        const { data, error } = await supabase
          .from('briefs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          return;
        }

        const briefsData = data || [];
        setLocalBriefs(briefsData);
        if (setBriefs) {
          setBriefs(briefsData);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch briefs');
      } finally {
        setIsLoading(false);
      }
    }

    // If we have initial briefs, use them, otherwise fetch
    if (initialBriefs && initialBriefs.length > 0) {
      setLocalBriefs(initialBriefs);
      setIsLoading(false);
    } else {
      fetchBriefs();
    }
  }, [initialBriefs, setBriefs]);

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
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localBriefs.map((brief) => (
          <BriefCard key={brief.id} brief={brief} />
        ))}
      </section>
    </div>
  );
}