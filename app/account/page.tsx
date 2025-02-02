'use client';

import { MainLayout } from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    }

    getUser();
  }, []);

  const handleSignOut = async () => {
    setShowSignOutDialog(false);
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Email</h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>

          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Account ID</h2>
            <p className="text-muted-foreground">{user?.id}</p>
          </div>

          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Last Sign In</h2>
            <p className="text-muted-foreground">
              {new Date(user?.last_sign_in_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="pt-6">
          <Button 
            variant="destructive"
            onClick={() => setShowSignOutDialog(true)}
          >
            Sign Out
          </Button>

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
        </div>
      </div>
    </MainLayout>
  );
} 