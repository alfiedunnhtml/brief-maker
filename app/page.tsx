"use client";

import { useState, useEffect } from "react";
import { BriefList } from "@/components/brief-list";
import { MainLayout } from "@/components/main-layout";
import { BriefGeneratorSection } from "@/components/brief-generator-section";
import { supabase, type Brief } from "@/lib/supabase";

export default function Home() {
  const [briefs, setBriefs] = useState<Brief[]>([]);

  useEffect(() => {
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

    fetchBriefs();
  }, []);

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

  return (
    <MainLayout>
      <div className="max-w-[1250px] mx-auto">
        <BriefGeneratorSection onBriefGenerated={handleBriefGenerated} />
        <BriefList briefs={briefs} setBriefs={setBriefs} showTitle />
      </div>
    </MainLayout>
  );
}
