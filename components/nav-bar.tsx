"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
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
import Link from "next/link";

export function NavBar() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsDialogOpen(false);
    // Refresh the page to reset all states
    window.location.reload();
  };

  return (
    <header className="flex justify-end border-b bg-background">
      <div className=" flex h-16 max-w-7xl items-center justify-end px-8">
        {isSignedIn ? (
          <div className="flex items-center gap-4">
            <Link href="/account">
              <Button variant="outline">My Account</Button>
            </Link>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="gap-2"
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
                    <Button variant="ghost">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button 
                    variant="destructive" 
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
} 