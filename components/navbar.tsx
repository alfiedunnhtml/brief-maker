"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Heart, LogOut, UserIcon, Settings, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import type { User } from '@supabase/supabase-js';
import { useAdmin } from "@/lib/admin-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const { isAdmin } = useAdmin();

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
    setShowSignOutDialog(false);
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 shadow-sm right-0 z-50 bg-background">
      <div className="w-full px-8">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <div className="w-[240px]">
            <Link href="/" className="text-xl font-bold">
              Brief Maker
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex items-center justify-center gap-1">
            <Link href="/">
              <Button
                variant="ghost"
                className={cn(
                  "gap-2",
                  pathname === "/" && "bg-accent"
                )}
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/briefs">
              <Button
                variant="ghost"
                className={cn(
                  "gap-2",
                  pathname === "/briefs" && "bg-accent"
                )}
              >
                <Library className="h-4 w-4" />
                Briefs
              </Button>
            </Link>
            <Link href="/liked-briefs">
              <Button
                variant="ghost"
                className={cn(
                  "gap-2",
                  pathname === "/liked-briefs" && "bg-accent"
                )}
              >
                <Heart className="h-4 w-4" />
                Liked Briefs
              </Button>
            </Link>
          </nav>

          {/* Auth Section */}
          {!loading && (
            <div className="w-[240px] flex items-center justify-end gap-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin">
                      <Button
                        variant="ghost"
                        className={cn(
                          "gap-2",
                          pathname === "/admin" && "bg-accent"
                        )}
                      >
                        <Settings className="h-4 w-4" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link href="/account">
                    <Button 
                      variant="ghost" 
                      className="gap-2"
                    >
                      <UserIcon className="h-4 w-4" />
                      Account
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-100"
                    onClick={() => setShowSignOutDialog(true)}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/sign-in">
                    <Button variant="ghost">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/sign-in">
                    <Button>
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sign Out Dialog */}
      <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to sign out?</DialogTitle>
            <DialogDescription>
              You will need to sign in again to access your liked briefs and account settings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowSignOutDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
} 