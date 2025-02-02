"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LikeButton } from "@/components/ui/like-button";
import { Spinner } from "@/components/ui/spinner";
import { supabase, type Brief } from "@/lib/supabase";
import { MainLayout } from "@/components/main-layout";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { BriefList } from "@/components/brief-list";

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



export default function BriefPage() {
  const params = useParams();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="h-[calc(75vh)]">
          <div className="grid h-full grid-cols-1 lg:grid-cols-[2fr,1fr,1fr] gap-6">
            {/* Left Column */}
            <div className="flex flex-col gap-6 min-w-0">
              {/* Brief */}
              <Card className="flex-1 overflow-hidden min-h-0">
                <CardHeader className="flex-none border-b">
                  <div className="flex items-center justify-between mb-2">
                    <PageCardTitle>Project Brief</PageCardTitle>
                    <LikeButton briefId={brief.id.toString()} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    Generated on {new Date(brief.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      {brief.industry}
                    </span>
                    <span 
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        brief.difficulty === "Easy"
                          ? "bg-green-50 text-green-700 ring-green-600/20"
                          : brief.difficulty === "Medium"
                          ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                          : "bg-red-50 text-red-700 ring-red-600/20"
                      )}
                    >
                      {brief.difficulty}
                    </span>
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
                    <h3 className="text-base font-medium">Required Pages</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Filler Text </li>
                      <li>• Filler Text </li>
                      <li>• Filler Text </li>
                      <li>• Filler Text </li>
                      <li>• Filler Text </li>
                      <li>• Filler Text </li>
                      <li>• Filler Text </li>
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="min-w-0">
              <Card className="h-full overflow-hidden">
                <CardHeader className="flex-none border-b">
                  <PageCardTitle>Comments</PageCardTitle>
                  <CardDescription>Discuss this brief</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-5rem)] overflow-y-auto pt-6">
                  <div className="text-sm text-muted-foreground">
                    Comments coming soon...
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