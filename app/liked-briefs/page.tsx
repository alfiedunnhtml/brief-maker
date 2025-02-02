"use client";

import { useState, useEffect } from "react";
import { BriefList } from "@/components/brief-list";
import { MainLayout } from "@/components/main-layout";
import { supabase, type Brief } from "@/lib/supabase";

export default function LikedBriefsPage() {
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

  return (
    <MainLayout>
      <div className="max-w-[1250px] mx-auto">
        <BriefList briefs={briefs} setBriefs={setBriefs} showTitle />
      </div>
    </MainLayout>
  );
} 