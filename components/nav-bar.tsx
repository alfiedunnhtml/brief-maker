"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut, Heart } from "lucide-react";
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
import { useRouter } from "next/navigation";

export function NavBar() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    setIsDialogOpen(false);
    // Refresh the page to reset all states
    window.location.reload();
  };

  return (
    <header className="mb-12 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-4">

        <h1 className="text-2xl font-bold">Brief Maker</h1>
      </Link>

      <nav>
        {isSignedIn ? (
          <div className="flex items-center gap-4">
            <Link href="/liked-briefs">
              <Button variant="outline" className="gap-2">
                <Heart className="h-4 w-4" />
                Liked Briefs
              </Button>
            </Link>
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
      </nav>
    </header>
  );
} 