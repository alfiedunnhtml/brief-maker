"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LikeButton } from "@/components/ui/like-button";
import { Spinner } from "@/components/ui/spinner";
import { supabase, type Brief } from "@/lib/supabase";

interface LikedBrief {
  brief_id: number;
  briefs: Brief;
  user_id: string;
  created_at: string;
}

export default function LikedBriefsPage() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    async function fetchLikedBriefs() {
      try {
        const { data, error } = await supabase
          .from('liked_briefs')
          .select(`
            brief_id,
            user_id,
            created_at,
            briefs (
              id,
              content,
              industry,
              difficulty,
              created_at
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching liked briefs:', error);
          setError(error.message);
          return;
        }

        // Transform the data to get the briefs array with proper typing
        const typedData = data as unknown as LikedBrief[];
        const likedBriefs = typedData.map(item => item.briefs);
        setBriefs(likedBriefs);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch liked briefs');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLikedBriefs();
  }, [isSignedIn, userId, router]);

  const handleLikeToggle = async (briefId: string) => {
    if (!isSignedIn) return;

    try {
      const { error: deleteError } = await supabase
        .from('liked_briefs')
        .delete()
        .eq('user_id', userId)
        .eq('brief_id', briefId);

      if (deleteError) throw deleteError;

      // Remove the brief from the local state
      setBriefs(prev => prev.filter(brief => brief.id !== briefId));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (!isSignedIn) {
    return null; // Router will handle redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <NavBar />
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <Spinner className="mb-4 h-8 w-8" />
              <div className="text-muted-foreground">Loading your liked briefs...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <NavBar />
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold">Your Liked Briefs</h1>
        
        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : briefs.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>You haven't liked any briefs yet.</p>
            <p className="mt-2">Go to the home page to discover and like some briefs!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {briefs.map((brief) => (
              <Card key={brief.id} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>Web Design Brief</CardTitle>
                    <div className="flex items-center gap-2">
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
                      <LikeButton 
                        briefId={brief.id.toString()}
                        initialLiked={true}
                      />
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
          </div>
        )}
      </div>
    </div>
  );
} 