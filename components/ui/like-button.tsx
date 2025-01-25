"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface LikeButtonProps {
  isLiked: boolean;
  onToggle: () => void;
  className?: string;
}

export function LikeButton({ isLiked, onToggle, className }: LikeButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={cn(
        "transition-all hover:scale-110 active:scale-95",
        className
      )}
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