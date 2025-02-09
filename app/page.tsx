/**
 * Home Page
 * 
 * The main landing page of the application. It features:
 * 1. A brief generator section where users can create new briefs
 * 2. A preview section showing the latest generated brief
 * 3. A grid of previously generated briefs
 * 
 * The page handles:
 * - Brief generation and storage
 * - Real-time updates of the brief list
 * - Brief deletion
 * - Navigation to individual brief pages
 */

"use client";



import { useState, useEffect } from "react";
import { BriefList } from "@/components/brief-list";
import { MainLayout } from "@/components/main-layout";
import { BriefGeneratorSection } from "@/components/brief-generator-section";
import { supabase, type Brief } from "@/lib/supabase";
import { BriefCard } from "@/components/brief-card";
import Link from "next/link";




export default function Home() {
  // State for all briefs and the most recently generated brief
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [latestBrief, setLatestBrief] = useState<Brief | null>(null);

  // Fetch briefs on component mount
  useEffect(() => {
    fetchBriefs();
  }, []);

  // Fetch all briefs from the database
  async function fetchBriefs() {
    try {
      const { data, error } = await supabase
        .from('briefs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching briefs:', error);
        return;
      }

      setBriefs(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Handle the generation of a new brief
  const handleBriefGenerated = async (brief: Brief) => {
    try {
      // console.log('Saving brief:', brief);
      const { data, error } = await supabase
        .from('briefs')
        .insert([
          {
            id: brief.id,
            content: brief.content,
            industry: brief.industry,
            difficulty: brief.difficulty,
            company_name: brief.company_name,
            created_at: brief.created_at,
            brand_colors: brief.brand_colors,
            style: brief.style,
            deliverables: brief.deliverables,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // console.log('Saved brief:', data);
      setBriefs((prev) => [data, ...prev]);
      setLatestBrief(data);
    } catch (error) {
      console.error('Error saving brief:', error);
    }
  };

  // Handle the deletion of a brief
  const handleBriefDeleted = (id: number) => {
    setBriefs((prev) => prev.filter(brief => brief.id !== id));
    if (latestBrief?.id === id) {
      setLatestBrief(null);
    }
  };



  // Format the brief content into paragraphs
  function formatContent(content: string) {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="text-sm text-muted-foreground mb-2">
        {paragraph}
      </p>
    ));
  }

  return (
    <MainLayout>
      <div className="flex flex-col items-center max-w-[1250px] mx-auto space-y-16 py-8 ">
        {/* Main container with responsive grid */}



        <div className="grid grid-cols-1 max-w-[700px] lg:grid-cols-[400px,1fr] gap-4 lg:gap-8 lg:max-w-none">
          <div className="w-full">
            <BriefGeneratorSection onBriefGenerated={handleBriefGenerated} />
          </div>
          {/* Generated brief section */}
          {latestBrief ? (
            <Link href={`/brief/${latestBrief.id}`}>
              <div className="min-h-fit lg:min-h-72 rounded-lg border bg-card p-4 lg:p-6 transition-all hover:shadow-lg">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr,300px] gap-6">
                  {/* Brief Content */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Generated Brief</h2>
                    <div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {latestBrief.industry}
                        </span>
                        <span 
                          className={`rounded-md px-2 py-1 text-xs font-medium ${
                            latestBrief.difficulty === "Easy"
                              ? "bg-green-100 text-green-800"
                              : latestBrief.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : latestBrief.difficulty === "Hard"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {latestBrief.difficulty}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {latestBrief.company_name || "Web Design Brief"}
                      </h3>
                      <div className="space-y-2 prose prose-sm max-w-none">
                        {formatContent(latestBrief.content)}
                      </div>
                    </div>
                  </div>

                  {/* Brief Details */}
                  <div className="border-t xl:border-t-0 xl:border-l pt-4 xl:pt-0 xl:pl-6">
                    <h3 className="text-lg font-semibold mb-4">Brief Details</h3>
                    <dl className="space-y-4 text-sm">
                      <div>
                        <dt className="text-base font-medium">Company Name</dt>
                        <dd className="text-muted-foreground mt-1">
                          {latestBrief.company_name || "Not specified"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-base font-medium">Website Style</dt>
                        <dd className="text-muted-foreground mt-1">
                          {latestBrief.style || "Not specified"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-base font-medium mb-2">Brand Colors</dt>
                        <div className="flex flex-wrap gap-2">
                          {latestBrief.brand_colors && latestBrief.brand_colors.length > 0 ? (
                            latestBrief.brand_colors.map((color, index) => (
                              <div 
                                key={index}
                                className="border-2 border-gray-100 h-10 w-10 sm:h-12 sm:w-12 rounded"
                                style={{ backgroundColor: color }}
                              />
                            ))
                          ) : (
                            <dd className="text-muted-foreground">No brand colors specified</dd>
                          )}
                        </div>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            // placeholder for the brief with responsive height
            <div className="h-48 lg:h-72 rounded-lg border bg-card p-4 lg:p-6 flex items-center justify-center">
              <h2 className="text-muted-foreground text-xl lg:text-2xl font-medium text-center px-4">
                Generate a brief to get started...
              </h2>
            </div>

          )}
        </div>

        {/* More Briefs Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold">More Briefs</h2>
              <p className="text-muted-foreground">Browse through previously generated briefs</p>
            </div>
          </div>
          <BriefList 
            limit={9} 
            blurOverlay 
            onDelete={handleBriefDeleted}
          />
        </div>
      </div>
    </MainLayout>
  );
}
