"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

interface LikeButtonProps {
  isLiked: boolean;
  onToggle: () => void;
  className?: string;
}

export function LikeButton({ isLiked, onToggle, className }: LikeButtonProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleClick = () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    onToggle();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
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