"use client";

import { useState, useEffect } from "react";
import { BriefList } from "@/components/brief-list";
import { MainLayout } from "@/components/main-layout";
import { BriefGeneratorSection } from "@/components/brief-generator-section";
import { supabase, type Brief } from "@/lib/supabase";
import { BriefCard } from "@/components/brief-card";

export default function Home() {
  const [briefs, setBriefs] = useState<Brief[]>([]);

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
    }
  }

  const handleBriefGenerated = async (brief: Brief) => {
    try {
      console.log('Saving brief:', brief);
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
            brand_colors: brief.brand_colors,
            style: brief.style,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Saved brief:', data);
      setBriefs((prev) => [data, ...prev]);
    } catch (error) {
      console.error('Error saving brief:', error);
    }
  };

  const handleBriefDeleted = (id: number) => {
    setBriefs((prev) => prev.filter(brief => brief.id !== id));
  };

  return (
    <MainLayout>
      <div className="max-w-[1250px] mx-auto space-y-16">
        {/* Top Section */}
        <div className="grid grid-cols-[400px,1fr] gap-8">
          <div>
            <BriefGeneratorSection onBriefGenerated={handleBriefGenerated} />
          </div>
          {/* Generated brief section */}
          <div className="h-72 rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Generated Brief</h2>
            <p className="text-muted-foreground">
              Click "Generate Brief" to create a new web design brief
            </p>
          </div>
        </div>

        {/* More Briefs Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold">More Briefs</h2>
              <p className="text-muted-foreground">Browse through previously generated briefs</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {briefs.map((brief) => (
              <BriefCard 
                key={brief.id} 
                brief={brief} 
                onDelete={handleBriefDeleted}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
