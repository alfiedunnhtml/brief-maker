"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

interface LikeButtonProps {
  briefId: string;
  initialLiked?: boolean;
  className?: string;
}

export function LikeButton({ briefId, initialLiked = false, className }: LikeButtonProps) {
  const router = useRouter();
  const { isSignedIn, userId } = useAuth();
  const [isLiked, setIsLiked] = React.useState(initialLiked);
  const [isLoading, setIsLoading] = React.useState(false);

  // Check if the brief is liked on component mount
  React.useEffect(() => {
    if (!isSignedIn || !userId) return;

    async function checkLikeStatus() {
      try {
        const { data, error } = await supabase
          .from('liked_briefs')
          .select('id')
          .eq('user_id', userId)
          .eq('brief_id', briefId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking like status:', error);
          return;
        }

        setIsLiked(!!data);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    checkLikeStatus();
  }, [briefId, isSignedIn, userId]);

  const handleClick = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);
    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('liked_briefs')
          .delete()
          .eq('user_id', userId)
          .eq('brief_id', briefId);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('liked_briefs')
          .insert([
            {
              user_id: userId,
              brief_id: briefId,
            },
          ]);

        if (error) throw error;
      }

      setIsLiked(!isLiked);
      router.refresh(); // Refresh the page to update any lists that depend on like status
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
        !isSignedIn && "opacity-50",
        className
      )}
      title={!isSignedIn ? "Sign in to like briefs" : undefined}
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