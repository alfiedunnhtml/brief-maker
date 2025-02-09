"use client";

import { MainLayout } from "@/components/main-layout";
import { BriefCard } from "@/components/brief-card";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import type { Brief } from "@/lib/supabase";

export default function LikedBriefsPage() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedBriefs();
  }, []);

  async function fetchLikedBriefs() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // First get the liked brief IDs
      const { data: likedBriefs } = await supabase
        .from('liked_briefs')
        .select('brief_id')
        .eq('user_id', session.user.id);

      if (likedBriefs && likedBriefs.length > 0) {
        // Then fetch the actual briefs
        const briefIds = likedBriefs.map(like => like.brief_id);
        const { data: briefsData } = await supabase
          .from('briefs')
          .select('*')
          .in('id', briefIds)
          .order('created_at', { ascending: false });

        setBriefs(briefsData || []);
      }
    }
    setLoading(false);
  }

  const handleBriefDeleted = (id: number) => {
    setBriefs((prev) => prev.filter(brief => brief.id !== id));
  };

  return (
    <MainLayout>
      <div className="max-w-[1250px] mx-auto py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Liked Briefs</h1>
          <p className="text-muted-foreground">
            Your collection of saved briefs
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
                You haven't liked any briefs yet
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {briefs.map((brief) => (
              <BriefCard 
                key={brief.id} 
                brief={brief} 
                initialLiked={true}
                onDelete={handleBriefDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 