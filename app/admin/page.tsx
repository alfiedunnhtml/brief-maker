'use client';

import { MainLayout } from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin-context";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminUser {
  user_id: string;
  email: string;
}

interface BriefWithLikes {
  id: number;
  content: string;
  industry: string;
  difficulty: string;
  company_name?: string;
  created_at: string;
  likes_count: number;
}

export default function AdminPage() {
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [briefs, setBriefs] = useState<BriefWithLikes[]>([]);
  const [loading, setLoading] = useState(true);
  const [briefToDelete, setBriefToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, isAdminLoading, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        
        // Fetch briefs with like counts
        const { data: briefsData } = await supabase
          .from('briefs')
          .select(`
            *,
            likes_count:liked_briefs(count)
          `)
          .order('created_at', { ascending: false });

        if (briefsData) {
          setBriefs(briefsData.map(brief => ({
            ...brief,
            likes_count: brief.likes_count[0].count,
          })));
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleDeleteBrief = async () => {
    if (!briefToDelete) return;

    try {
      const { error } = await supabase
        .from('briefs')
        .delete()
        .eq('id', briefToDelete);

      if (error) throw error;

      setBriefs(briefs.filter(brief => brief.id !== briefToDelete));
      setBriefToDelete(null);
    } catch (error) {
      console.error('Error deleting brief:', error);
    }
  };

  if (isAdminLoading || loading) {
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

  if (!isAdmin) {
    return null;
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage briefs and user permissions
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Users with administrative access</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {users.map((user) => (
                  <li key={user.user_id} className="flex items-center justify-between">
                    <span>{user.email}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Briefs</CardTitle>
              <CardDescription>Manage all generated briefs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {briefs.map((brief) => (
                  <div key={brief.id} className="flex items-start justify-between border-b pb-4">
                    <div>
                      <h3 className="font-semibold">{brief.company_name || "Web Design Brief"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {brief.industry} • {brief.difficulty} • {new Date(brief.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Likes: {brief.likes_count}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-100"
                      onClick={() => setBriefToDelete(brief.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={!!briefToDelete} onOpenChange={() => setBriefToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Brief</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this brief? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setBriefToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteBrief}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
} 