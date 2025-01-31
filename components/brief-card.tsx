import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LikeButton } from "@/components/ui/like-button";
import { type Brief } from "@/lib/supabase";
import Link from "next/link";

interface BriefCardProps {
  brief: Brief;
  initialLiked?: boolean;
}

export function BriefCard({ brief, initialLiked }: BriefCardProps) {
  return (
    <div className="group relative">
      <Link href={`/brief/${brief.id}`} className="block">
        <Card className="transition-all group-hover:shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <CardTitle>{brief.company_name || "Web Design Brief"}</CardTitle>
                <div className="relative z-10" onClick={(e) => e.preventDefault()}>
                  <LikeButton briefId={brief.id.toString()} initialLiked={initialLiked} />
                </div>
              </div>
              <div className="flex gap-2">
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                  {brief.industry}
                </span>
                <span 
                  className={`rounded-full px-2 py-1 text-xs ${
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
            <CardDescription>
              Generated on {new Date(brief.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {brief.content}
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
} 