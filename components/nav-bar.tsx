"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function NavBar() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="mb-12 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-4">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Brief Maker logo"
          width={100}
          height={20}
          priority
        />
        <h1 className="text-2xl font-bold">Brief Maker</h1>
      </Link>

      <nav>
        {isSignedIn ? (
          <div className="flex items-center gap-4">
            <Link href="/account">
              <Button variant="outline">My Account</Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
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