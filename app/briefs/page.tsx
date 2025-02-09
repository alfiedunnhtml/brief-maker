"use client";

import { MainLayout } from "@/components/main-layout";
import { BriefList } from "@/components/brief-list";
import { useState } from "react";
import type { Brief } from "@/lib/supabase";

export default function BriefsPage() {
  const [briefs, setBriefs] = useState<Brief[]>([]);

  return (
    <MainLayout>
      <div className="max-w-[1250px] mx-auto py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">All Briefs</h1>
          <p className="text-muted-foreground">
            Browse through all generated briefs
          </p>
        </div>

        <BriefList 
          briefs={briefs}
          setBriefs={setBriefs}
        />
      </div>
    </MainLayout>
  );
} 