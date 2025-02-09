"use client";

import { MainLayout } from "@/components/main-layout";
import { BriefCard } from "@/components/brief-card";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import type { Brief } from "@/lib/supabase";

export default function BriefsPage() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBriefs();
  }, []);

  async function fetchBriefs() {
    try {
      const { data, error } = await supabase
        .from('briefs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching briefs:', error);
        return;
      }

      setBriefs(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleBriefDeleted = (id: number) => {
    setBriefs((prev) => prev.filter(brief => brief.id !== id));
  };

  return (
    <MainLayout>
      <div className="max-w-[1250px] mx-auto py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">All Briefs</h1>
          <p className="text-muted-foreground">
            Browse through all generated briefs
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          </div>
        ) : briefs.length === 0 ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <div className="text-muted-foreground">
                No briefs have been generated yet
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {briefs.map((brief) => (
              <BriefCard 
                key={brief.id} 
                brief={brief}
                onDelete={handleBriefDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 