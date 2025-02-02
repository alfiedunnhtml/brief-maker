"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Settings, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";

export function SideBar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const isAuthPage = pathname?.includes('/sign-') || pathname?.includes('/account');

  if (isAuthPage) return null;

  const handleSignOut = async () => {
    await signOut();
    setIsDialogOpen(false);
    window.location.reload();
  };

  const links = [
    {
      href: "/",
      label: "Home",
      icon: Home
    },
    {
      href: "/liked-briefs",
      label: "Liked Briefs",
      icon: Heart
    }
  ];

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[250px] flex-col border-r bg-background px-4 py-8">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold">Brief Maker</h1>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Account section at bottom */}
      <div className="mt-auto space-y-2">
        {isSignedIn ? (
          <>
            <Link href="/account" className="w-full">
              <Button variant="outline" className="w-full justify-start gap-2">
                <User className="h-4 w-4" />
                My Account
              </Button>
            </Link>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign Out</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to sign out? You will need to sign in again to access your account.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="space-y-2">
            <Link href="/sign-in" className="w-full">
              <Button variant="ghost" className="w-full justify-start">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" className="w-full">
              <Button className="w-full justify-start">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
} 