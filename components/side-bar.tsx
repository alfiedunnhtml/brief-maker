"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Link href="/">
              <h2 className={cn(
                "px-4 py-2 text-sm font-semibold rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/" && "bg-accent"
              )}>
                <Home className="h-4 w-4 mr-2 inline-block" />
                Home
              </h2>
            </Link>
            <Link href="/liked-briefs">
              <h2 className={cn(
                "px-4 py-2 text-sm font-semibold rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/liked-briefs" && "bg-accent"
              )}>
                <Heart className="h-4 w-4 mr-2 inline-block" />
                Liked Briefs
              </h2>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 