'use client';

import { MainLayout } from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin-context";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
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

interface BriefData {
  content: string;
  industry: string;
  difficulty: string;
  company_name: string | null;
  brand_colors: string[] | null;
  style: string | null;
}

const difficultyOptions = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Difficult', label: 'Difficult' },
  { value: 'Hard', label: 'Hard' },
];

export default function EditBriefPage({ params }: { params: { id: string } }) {
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const router = useRouter();
  const [brief, setBrief] = useState<BriefData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, isAdminLoading, router]);

  useEffect(() => {
    async function fetchBrief() {
      try {
        const { data, error } = await supabase
          .from('briefs')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setBrief(data);
      } catch (error) {
        console.error('Error fetching brief:', error);
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    }

    if (isAdmin) {
      fetchBrief();
    }
  }, [isAdmin, params.id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!brief) return;
    setBrief({ ...brief, [e.target.id]: e.target.value });
  };

  const handleDifficultyChange = (value: string) => {
    if (!brief) return;
    setBrief({ ...brief, difficulty: value });
  };

  const handleSave = async () => {
    if (!brief) {
      console.log('Cannot save: brief is null');
      return;
    }

    setSaving(true);
    try {
      console.log('Attempting to save brief:', brief);
      const { data, error } = await supabase
        .from('briefs')
        .update({
          content: brief.content,
          industry: brief.industry,
          difficulty: brief.difficulty,
          company_name: brief.company_name,
          brand_colors: brief.brand_colors,
          style: brief.style,
        })
        .eq('id', params.id)
        .select();

      if (error) {
        console.error('Supabase error while updating brief:', error);
        throw error;
      }

      console.log('Brief updated successfully:', data);
      router.back();
    } catch (error) {
      console.error('Error updating brief:', error);
      alert('Failed to save brief. Please check console for details.');

    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('briefs')
        .delete()
        .eq('id', params.id);

      if (error) throw error;
      router.push('/admin');
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

  if (!isAdmin || !brief) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Edit Brief</h1>
              <p className="text-muted-foreground">
                Make changes to the brief content and settings
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Brief
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Brief Content</CardTitle>
              <CardDescription>Edit the main content and metadata of the brief</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={brief.company_name || ''}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Brief Content</Label>
                <Textarea
                  id="content"
                  value={brief.content}
                  onChange={handleInputChange}
                  className="min-h-[200px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={brief.industry}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    id="difficulty"
                    value={brief.difficulty}
                    onChange={(e) => handleDifficultyChange(e.target.value)}
                    options={difficultyOptions}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Input
                  id="style"
                  value={brief.style || ''}
                  onChange={handleInputChange}
                  placeholder="Enter style preferences"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand_colors">Brand Colors</Label>
                <Input
                  id="brand_colors"
                  value={brief.brand_colors?.join(', ') || ''}
                  onChange={(e) => setBrief({ 
                    ...brief, 
                    brand_colors: e.target.value.split(',').map(color => color.trim()).filter(Boolean)
                  })}
                  placeholder="Enter colors separated by commas"
                />
              </div>
            </CardContent>
          </Card>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </MainLayout>
  );
} 