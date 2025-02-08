"use client";

import { useState, useEffect } from "react";
import { BriefList } from "@/components/brief-list";
import { MainLayout } from "@/components/main-layout";
import { BriefGeneratorSection } from "@/components/brief-generator-section";
import { supabase, type Brief } from "@/lib/supabase";
import { BriefCard } from "@/components/brief-card";
import Link from "next/link";

export default function Home() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [latestBrief, setLatestBrief] = useState<Brief | null>(null);

  useEffect(() => {
    fetchBriefs();
  }, []);

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

  const handleBriefGenerated = async (brief: Brief) => {
    try {
      console.log('Saving brief:', brief);
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
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Saved brief:', data);
      setBriefs((prev) => [data, ...prev]);
      setLatestBrief(data);
    } catch (error) {
      console.error('Error saving brief:', error);
    }
  };

  const handleBriefDeleted = (id: number) => {
    setBriefs((prev) => prev.filter(brief => brief.id !== id));
    if (latestBrief?.id === id) {
      setLatestBrief(null);
    }
  };

  function formatContent(content: string) {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="text-sm text-muted-foreground mb-2">
        {paragraph}
      </p>
    ));
  }

  return (
    <MainLayout>
      <div className="max-w-[1250px] mx-auto space-y-16">
        {/* Top Section */}
        <div className="grid grid-cols-[400px,1fr] gap-8">
          <div>
            <BriefGeneratorSection onBriefGenerated={handleBriefGenerated} />
          </div>
          {/* Generated brief section */}
          {latestBrief ? (
            <Link href={`/brief/${latestBrief.id}`}>
              <div className="min-h-72 rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
                <div className="grid grid-cols-[1fr,300px] gap-6">
                  {/* Brief Content */}
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Generated Brief</h2>
                    <div>
                      <div className="flex gap-2 mb-3">
                        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {latestBrief.industry}
                        </span>
                        <span 
                          className={`rounded-md px-2 py-1 text-xs font-medium ${
                            latestBrief.difficulty === "Easy"
                              ? "bg-green-100 text-green-800"
                              : latestBrief.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {latestBrief.difficulty}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {latestBrief.company_name || "Web Design Brief"}
                      </h3>
                      <div className="space-y-2">
                        {formatContent(latestBrief.content)}
                      </div>
                    </div>
                  </div>

                  {/* Brief Details */}
                  <div className="border-l pl-6">
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
                        <div className="flex gap-2">
                          {latestBrief.brand_colors && latestBrief.brand_colors.length > 0 ? (
                            latestBrief.brand_colors.map((color, index) => (
                              <div 
                                key={index}
                                className="border-2 border-gray-100 h-12 w-12 rounded"
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
            <div className="h-72 rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Generated Brief</h2>
              <p className="text-muted-foreground">
                Click "Generate Brief" to create a new web design brief
              </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {briefs.map((brief) => (
              <BriefCard 
                key={brief.id} 
                brief={brief} 
                onDelete={handleBriefDeleted}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
