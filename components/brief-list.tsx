"use client";

/**
 * BriefList Component
 * 
 * A versatile component that handles both the homepage preview (6 random briefs with blur)
 * and the full briefs page (all briefs in chronological order).
 * 
 * The component can:
 * 1. Display a fixed set of provided briefs (via initialBriefs prop)
 * 2. Fetch and display random briefs (when limit prop is provided)
 * 3. Fetch and display all briefs (when no limit is set)
 * 4. Show a blur overlay on the third row (via blurOverlay prop)
 */

import { useEffect, useState } from "react";
import { supabase, type Brief } from "@/lib/supabase";
import { Spinner } from "@/components/ui/spinner";
import { BriefCard } from "./brief-card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BriefListProps {
  briefs?: Brief[];                                    // Pre-fetched briefs (optional)
  setBriefs?: React.Dispatch<React.SetStateAction<Brief[]>>;  // Parent state updater
  blurOverlay?: boolean;                              // Show blur on third row
  limit?: number;                                     // Number of briefs to fetch
  onDelete?: (id: number) => void;                    // Callback when a brief is deleted
}

export function BriefList({ briefs: initialBriefs, setBriefs, blurOverlay, limit, onDelete }: BriefListProps) {
  // Component state management
  const [localBriefs, setLocalBriefs] = useState<Brief[]>([]); // Stores briefs locally
  const [isLoading, setIsLoading] = useState(true);            // Loading state
  const [error, setError] = useState<string | null>(null);     // Error handling

  // Function to fetch random briefs
  const fetchRandomBrief = async () => {
    try {
      const { count } = await supabase
        .from('briefs')
        .select('*', { count: 'exact', head: true });
        
      if (count) {
        // Get one random brief
        const offset = Math.floor(Math.random() * count);
        const { data, error } = await supabase
          .from('briefs')
          .select('*')
          .range(offset, offset);

        if (error) throw error;
        if (data && data[0]) {
          return data[0];
        }
      }
    } catch (error) {
      console.error('Error fetching random brief:', error);
    }
    return null;
  };

  // Handle brief deletion
  const handleBriefDeleted = async (id: number) => {
    try {
      // Delete the brief from the database
      const { error } = await supabase
        .from('briefs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Call the parent's onDelete handler if provided
      if (onDelete) {
        onDelete(id);
      }

      // If we're showing limited briefs (homepage), replace the deleted brief
      if (limit) {
        const newBrief = await fetchRandomBrief();
        if (newBrief) {
          setLocalBriefs(prev => 
            prev.map(brief => brief.id === id ? newBrief : brief)
          );
        } else {
          // If we couldn't get a new brief, just remove the deleted one
          setLocalBriefs(prev => prev.filter(brief => brief.id !== id));
        }
      } else {
        // For the full list page, just remove the brief
        setLocalBriefs(prev => prev.filter(brief => brief.id !== id));
      }
    } catch (error) {
      console.error('Error deleting brief:', error);
    }
  };

  // Effect hook to handle brief fetching
  useEffect(() => {
    // Define the async function to fetch briefs
    async function fetchBriefs() {
      try {
        // Initialize the base query
        let query = supabase
          .from('briefs')
          .select('*');

        // Handle random brief selection when limit is provided (e.g., homepage)
        if (limit) {
          // First, get the total count of briefs in the database
          const { count } = await supabase
            .from('briefs')
            .select('*', { count: 'exact', head: true });
            
          if (count) {
            // Calculate a random starting point to get random briefs
            // Ensures we don't try to fetch past the end of the available briefs
            const offset = Math.max(0, Math.floor(Math.random() * (count - limit)));
            // Modify query to fetch 'limit' number of briefs from the random offset
            query = query.range(offset, offset + limit - 1);
          }
        }

        // For the full briefs page (no limit), order by newest first
        if (!limit) {
          query = query.order('created_at', { ascending: false });
        }

        // Execute the query
        const { data, error } = await query;

        // Handle any database errors
        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          return;
        }

        // Update both local and parent state with the fetched briefs
        const briefsData = data || [];
        setLocalBriefs(briefsData);
        if (setBriefs) {
          setBriefs(briefsData);
        }
      } catch (error) {
        // Handle any unexpected errors
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch briefs');
      } finally {
        // Always mark loading as complete
        setIsLoading(false);
      }
    }

    // If briefs were provided via props, use those instead of fetching
    if (initialBriefs && initialBriefs.length > 0) {
      setLocalBriefs(initialBriefs);
      setIsLoading(false);
    } else {
      // Otherwise, fetch briefs from the database
      fetchBriefs();
    }
  }, [initialBriefs, setBriefs, limit]); // Re-run if these dependencies change

  // Show loading spinner while fetching
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <Spinner className="mb-4 h-8 w-8" />
          <div className="text-muted-foreground">Loading your briefs...</div>
        </div>
      </div>
    );
  }

  // Show error message if something went wrong
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-500 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Render the grid of briefs
  return (
    <div>
      <section className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        "relative isolate" // Added isolate to create a new stacking context
      )}>
        {/* Map through briefs and render each one */}
        {localBriefs.map((brief) => (
          <BriefCard 
            key={brief.id} 
            brief={brief} 
            onDelete={handleBriefDeleted}
          />
        ))}
        {/* Enhanced blur overlay with multiple layers */}
        {blurOverlay && (
          <>
            {/* Blur layer */}
            <div 
              className="absolute inset-0 z-10 backdrop-blur-[2px] pointer-events-none"
              style={{ 
                top: '66%',
                background: 'linear-gradient(to bottom, rgba(252,252,252,0) 0%, rgba(252,252,252,0.8) 50%, rgba(252,252,252,1) 100%)',
                backdropFilter: 'blur(4px)'
              }}
            />
            {/* Content fade layer */}
            <div 
              className="absolute inset-0 z-20 pointer-events-none"
              style={{ 
                top: '66%',
                background: 'linear-gradient(to bottom, rgba(252,252,252,0) 0%, rgba(252,252,252,0.9) 100%)'
              }}
            />
            {/* View All button */}
            <div className="absolute left-1/2 z-30 -translate-x-1/2" style={{ top: 'calc(75% + 60px)' }}>
              <Link href="/briefs">
                <Button className="transition duration-300 ease-in-out bg-white border border-gray-300 hover:bg-black hover:text-white text-black gap-2 rounded-full shadow-none">
                  View All Briefs
                  <ArrowRight />
                </Button>
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}