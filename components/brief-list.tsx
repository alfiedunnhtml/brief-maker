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

import { useEffect, useState, useCallback } from "react";
import { supabase, type Brief } from "@/lib/supabase";
import { Spinner } from "@/components/ui/spinner";
import { BriefCard } from "./brief-card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ArrowUpDown, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";


interface BriefListProps {
  briefs?: Brief[];                                    // Pre-fetched briefs (optional)
  setBriefs?: React.Dispatch<React.SetStateAction<Brief[]>>;  // Parent state updater
  blurOverlay?: boolean;                              // Show blur on third row
  limit?: number;                                     // Number of briefs to fetch
  onDelete?: (id: number) => void;                    // Callback when a brief is deleted
}

// Difficulty order for sorting
const difficultyOrder = {
  "Easy": 1,
  "Medium": 2,
  "Hard": 3
};

export function BriefList({ briefs: initialBriefs, setBriefs, blurOverlay, limit, onDelete }: BriefListProps) {
  // Component state management
  const [localBriefs, setLocalBriefs] = useState<Brief[]>([]); // Stores briefs locally
  const [isLoading, setIsLoading] = useState(true);            // Loading state
  const [error, setError] = useState<string | null>(null);     // Error handling
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Sort order state
  const [selectedDifficulties, setSelectedDifficulties] = useState<Record<string, boolean>>({
    "Easy": true,
    "Medium": true,
    "Hard": true
  });
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  // Function to sort briefs by difficulty - Memoize the function
  const sortBriefsByDifficulty = useCallback((briefs: Brief[], order: 'asc' | 'desc') => {
    return [...briefs].sort((a, b) => {
      const orderA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
      const orderB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
      return order === 'asc' ? orderA - orderB : orderB - orderA;
    });
  }, []);

  // Toggle sort order
  const toggleSort = useCallback(() => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setLocalBriefs(prev => sortBriefsByDifficulty(prev, newOrder));
  }, [sortOrder, sortBriefsByDifficulty]);

  // Function to handle difficulty filter changes
  const handleDifficultyFilter = useCallback((difficulty: string) => {
    setSelectedDifficulties(prev => {
      const newSelection = { ...prev, [difficulty]: !prev[difficulty] };
      
      // Filter briefs based on new selection
      const filteredBriefs = initialBriefs || [];
      const filtered = filteredBriefs.filter(brief => 
        newSelection[brief.difficulty as keyof typeof difficultyOrder]
      );
      
      // Apply current sort order to filtered briefs
      const sorted = sortBriefsByDifficulty(filtered, sortOrder);
      setLocalBriefs(sorted);
      
      return newSelection;
    });
  }, [initialBriefs, sortBriefsByDifficulty, sortOrder]);

  // Function to fetch random briefs - Memoize the function
  const fetchRandomBrief = useCallback(async () => {
    try {
      const { count } = await supabase
        .from('briefs')
        .select('*', { count: 'exact', head: true });
        
      if (count) {
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
  }, []);

  // Handle brief deletion - Memoize the function
  const handleBriefDeleted = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('briefs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      onDelete?.(id);

      if (limit) {
        const newBrief = await fetchRandomBrief();
        if (newBrief) {
          setLocalBriefs(prev => 
            prev.map(brief => brief.id === id ? newBrief : brief)
          );
        } else {
          setLocalBriefs(prev => prev.filter(brief => brief.id !== id));
        }
      } else {
        setLocalBriefs(prev => prev.filter(brief => brief.id !== id));
      }
    } catch (error) {
      console.error('Error deleting brief:', error);
    }
  }, [limit, onDelete, fetchRandomBrief]);

  // Effect hook to handle brief fetching
  useEffect(() => {
    let mounted = true;

    async function fetchBriefs() {
      if (!mounted) return;
      
      try {
        setIsLoading(true);
        let query = supabase.from('briefs').select('*');

        if (limit) {
          const { count } = await supabase
            .from('briefs')
            .select('*', { count: 'exact', head: true });
            
          if (count && mounted) {
            const offset = Math.max(0, Math.floor(Math.random() * (count - limit)));
            query = query.range(offset, offset + limit - 1);
          }
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (!mounted) return;

        if (error) {
          setError(error.message);
          return;
        }

        const briefsData = data || [];
        setLocalBriefs(briefsData);
        setBriefs?.(briefsData);
      } catch (error) {
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Failed to fetch briefs');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    if (initialBriefs && initialBriefs.length > 0) {
      setLocalBriefs(initialBriefs);
      setIsLoading(false);
    } else {
      fetchBriefs();
    }

    return () => {
      mounted = false;
    };
  }, [initialBriefs, setBriefs, limit]);

  // Add this useEffect to handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      const isTablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;
      setIsMediumScreen(isTablet);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      {/* Show sort button when displaying all briefs (no limit) */}
      {!limit && !isLoading && localBriefs.length > 0 && (
        <div className="flex justify-end items-center gap-2 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter Difficulty
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Difficulty Levels</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.keys(difficultyOrder).map((difficulty) => (
                <DropdownMenuCheckboxItem
                  key={difficulty}
                  checked={selectedDifficulties[difficulty]}
                  onCheckedChange={() => handleDifficultyFilter(difficulty)}
                  className={cn(
                    difficulty === "Easy" && "text-green-800",
                    difficulty === "Medium" && "text-yellow-800",
                    difficulty === "Hard" && "text-red-800"
                  )}
                >
                  {difficulty}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="outline"
            onClick={toggleSort}
            className="gap-2 transition duration-300 ease-in-out hover:bg-black hover:text-white"
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort by Difficulty ({sortOrder === 'asc' ? 'Easy to Hard' : 'Hard to Easy'})
          </Button>
        </div>
      )}
      <section className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        "relative isolate" // Added isolate to create a new stacking context
      )}>
        {/* If medium screen & there is a limit, show 3 less briefs */}
        {localBriefs
          .slice(0, isMediumScreen && limit ? limit - 3 : undefined)
          .map((brief) => (
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
            <div 
              className="absolute left-1/2 z-30 -translate-x-1/2" 
              style={{ 
                top: 'calc(75% + 60px)'
              }}
            >
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