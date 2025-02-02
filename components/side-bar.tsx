"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, LogOut, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import type { User } from '@supabase/supabase-js';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth state on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await supabase.auth.signOut();
      window.location.href = '/';
    }
  };

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

        {/* Auth section at bottom */}
        <div className="px-3 py-2 mt-auto">
          {!loading && (
            <div className="space-y-2">
              {user ? (
                <>
                  <Link href="/account">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                    >
                      <UserIcon className="h-4 w-4" />
                      Account
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-100"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/sign-in">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/sign-in">
                    <Button 
                      className="w-full justify-start"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 