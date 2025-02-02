"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  briefId: number;
  initialLiked?: boolean;
  className?: string;
}

export function LikeButton({ briefId, initialLiked = false, className }: LikeButtonProps) {
  const [isLiked, setIsLiked] = React.useState(initialLiked);
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const router = useRouter();

  React.useEffect(() => {
    // Check if user is logged in and if they've liked this brief
    async function checkLikeStatus() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data, error } = await supabase
            .from('liked_briefs')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('brief_id', briefId)
            .maybeSingle(); // Use maybeSingle() instead of single()

          if (error) {
            console.error('Error checking like status:', error);
            return;
          }

          setIsLiked(!!data);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    }

    checkLikeStatus();
  }, [briefId]);

  const handleClick = async () => {
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }

    setIsLoading(true);
    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('liked_briefs')
          .delete()
          .eq('user_id', user.id)
          .eq('brief_id', briefId);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('liked_briefs')
          .insert([
            {
              user_id: user.id,
              brief_id: briefId,
            },
          ]);

        if (error) throw error;
      }

      setIsLiked(!isLiked);
      router.refresh();
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "transition-all hover:scale-110 active:scale-95",
        !user && "opacity-50",
        className
      )}
      title={!user ? "Sign in to like briefs" : undefined}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
        )}
      />
    </Button>
  );
} 