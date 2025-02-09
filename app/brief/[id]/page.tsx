"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LikeButton } from "@/components/ui/like-button";
import { Spinner } from "@/components/ui/spinner";
import { supabase, type Brief } from "@/lib/supabase";
import { MainLayout } from "@/components/main-layout";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { BriefList } from "@/components/brief-list";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Add this wrapper component at the top of your BriefPage component
const PageCardTitle = ({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof CardTitle>) => (
  <CardTitle 
    className={cn(
      "text-2xl font-semibold tracking-tight",
      className
    )} 
    {...props}
  >
    {children}
  </CardTitle>
);

// Simplify the Comment interface
interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
}

export default function BriefPage() {
  const params = useParams();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchBrief() {
      try {
        const { data, error } = await supabase
          .from('briefs')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          return;
        }

        setBrief(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch brief');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBrief();
  }, [params.id]);

  useEffect(() => {
    // Check auth state on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  // Simplified fetch comments
  useEffect(() => {
    async function fetchComments() {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('brief_id', params.id)
        .order('created_at', { ascending: true });
      
      setComments(data || []);
    }

    if (params.id) {
      fetchComments();
    }
  }, [params.id]);

  // Simplified submit comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          brief_id: parseInt(params.id as string),
          user_id: user.id,
          content: newComment.trim()
        })
        .select()
        .single();

      if (error) throw error;
      
      setComments(prev => [...prev, data]);
      setNewComment("");
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || error || !brief) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[calc(75vh)]">
          <div className="text-center">
            {isLoading ? (
              <>
                <Spinner className="mb-4 h-8 w-8" />
                <div className="text-muted-foreground">Loading brief...</div>
              </>
            ) : (
              <div className="text-red-500">{error || "Brief not found"}</div>
            )}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-16 max-w-[1250px] mx-auto">
        {/* Dashboard */}
        <div className="">
          <div className="grid h-full grid-cols-1 lg:grid-cols-[2fr,1fr,1fr] gap-6">
            {/* Left Column */}
            <div className="flex flex-col gap-6 min-w-0">
              {/* Brief */}
              <Card className="flex-1 overflow-hidden min-h-0">
                <CardHeader className="flex-none border-b">
                  <div className="flex items-center justify-between mb-2">
                    <PageCardTitle>Project Brief</PageCardTitle>
                    <LikeButton briefId={brief.id} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    Generated on {new Date(brief.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2 ">
                    {/* Tags */}
                    <div className="flex gap-2 pt-2">
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
                  </div>
                </CardHeader>
                <CardContent className="h-[calc(100%-8rem)] overflow-y-auto pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-medium mb-2">Company Overview</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {brief.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Column */}
            <div className="flex flex-col gap-6 min-w-0">
              {/* Deliverables */}
              <Card className="flex-1 overflow-hidden min-h-0">
                <CardHeader className="flex-none border-b">
                  <PageCardTitle>Deliverables</PageCardTitle>
                  <CardDescription>Key requirements and features</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-5rem)] overflow-y-auto pt-6">
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Required Features</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      {brief.deliverables && brief.deliverables.length > 0 ? (
                        brief.deliverables.map((deliverable, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-yellow-500">•</span>
                            <span>{deliverable.charAt(0).toUpperCase() + deliverable.slice(1)}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-foreground">No specific features required</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Brief Details */}
              <Card className="flex-1 overflow-hidden min-h-0">
                <CardHeader className="flex-none border-b">
                  <PageCardTitle>Brief Details</PageCardTitle>
                  <CardDescription>Company and design specifications</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-5rem)] overflow-y-auto pt-6">
                  <div className="space-y-6">
                    <div>
                      <dl className="grid grid-cols-1 gap-4 text-sm">
                        <div>
                          <h3 className="text-base font-medium mb-2">Brand Colors</h3>
                          <div className="flex gap-2">
                            {brief.brand_colors && brief.brand_colors.length > 0 ? (
                              brief.brand_colors.map((color, index) => (
                                <div 
                                  key={index}
                                  className="border-2 border-gray-100	h-12 w-12 rounded"
                                  style={{ backgroundColor: color }}
                                />
                              ))
                            ) : (
                              <div className="text-sm text-muted-foreground">No brand colors specified</div>
                            )}
                          </div>
                        </div>
                        <div>
                          <dt className="text-base font-medium">Company Name</dt>
                          <dd className="text-muted-foreground mt-1">{brief.company_name}</dd>
                        </div>
                        <div>
                          <dt className="text-base font-medium">Industry</dt>
                          <dd className="text-muted-foreground mt-1">{brief.industry}</dd>
                        </div>
                        <div>
                          <dt className="text-base font-medium">Website Style</dt>
                          <dd className="text-muted-foreground mt-1">
                            {brief.style || "No style specified"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Comments */}
            <div className="min-w-0">
              <Card className="h-full overflow-hidden">
                <CardHeader className="flex-none border-b">
                  <PageCardTitle>Comments</PageCardTitle>
                  <CardDescription>Discuss this brief</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col h-[calc(100%-5rem)]">
                  {/* Comments List */}
                  <div className="flex-1 overflow-y-auto pt-6">
                    {comments.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-8">
                        No comments yet. Be the first to comment!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <div key={comment.id} className="border-b pb-3">
                            <p className="text-sm text-muted-foreground">
                              {comment.content}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Comment Form */}
                  <div className="flex-none py-4 border-t">
                    <form onSubmit={handleSubmitComment} className=" space-y-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={user ? "Write a comment..." : "Sign in to comment"}
                        disabled={!user || isSubmitting}
                      />
                      <Button
                        className="w-full"
                        type="submit"
                        disabled={!user || !newComment.trim() || isSubmitting}
                      >
                        {isSubmitting ? "Posting..." : "Post Comment"}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Brief List */}
        <div className="mt-12 pb-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight mb-6">More Briefs</h2>
          <BriefList />
        </div>
      </div>
    </MainLayout>
  );
} 