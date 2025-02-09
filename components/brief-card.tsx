import { Card } from "@/components/ui/card";
import { LikeButton } from "@/components/ui/like-button";
import { type Brief } from "@/lib/supabase";
import Link from "next/link";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useAdmin } from "@/lib/admin-context";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BriefCardProps {
  brief: Brief;
  initialLiked?: boolean;
  onDelete?: (id: number) => void;
}

function truncateText(text: string, maxLength: number = 200) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function BriefCard({ brief, initialLiked, onDelete }: BriefCardProps) {
  const { isAdmin } = useAdmin();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Fetch comment count for this brief
    async function fetchCommentCount() {
      const { count } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('brief_id', brief.id);
      
      setCommentCount(count || 0);
    }

    fetchCommentCount();
  }, [brief.id]);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('briefs')
        .delete()
        .eq('id', brief.id);

      if (error) throw error;

      // Call the onDelete callback if provided
      onDelete?.(brief.id);
      
      // Refresh the page to update the list
      router.refresh();
    } catch (error) {
      console.error('Error deleting brief:', error);
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Link href={`/brief/${brief.id}`} className="block h-full">
        <Card className="relative flex h-full flex-col p-6">
          <div className="flex-1">
            {/* Admin Controls */}
            {isAdmin && (
              <div className="absolute right-4 top-5 flex gap-2">
                {/* Edit Button */}
                <Link href={`/admin/brief/${brief.id}`} onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-300 hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-300 hover:text-red-600"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Tags */}
            <div className="flex gap-2">
              <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                {brief.industry}
              </span>
              <span 
                className={`rounded-md px-2 py-1 text-xs font-medium ${
                  brief.difficulty === "Easy"
                    ? "bg-green-100 text-green-800"
                    : brief.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {brief.difficulty}
              </span>
            </div>

            {/* Title */}
            <h3 className="mt-3 text-xl font-semibold line-clamp-1">
              {brief.company_name || "Web Design Brief"}
            </h3>

            {/* Content */}
            <p className="mt-2 text-sm text-muted-foreground">
              {truncateText(brief.content)}
            </p>
          </div>

          {/* Footer Section */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{commentCount} comments</span>
              </div>
              <div onClick={(e) => e.preventDefault()}>
                <LikeButton briefId={brief.id} initialLiked={initialLiked} />
              </div>
            </div>
          </div>
        </Card>
      </Link>

      {/* Delete Confirmation Dialog */}
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
    </>
  );
} 