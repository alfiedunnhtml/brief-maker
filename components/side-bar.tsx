"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function SideBar() {
  const pathname = usePathname();
  
  const isAuthPage = pathname?.includes('/sign-') || pathname?.includes('/account');

  if (isAuthPage) return null;

  const links = [
    {
      href: "/",
      label: "Home",
      icon: Home
    },
    {
      href: "/liked-briefs",
      label: "Liked Briefs",
      icon: Heart
    }
  ];

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-[250px] border-r bg-background px-4 py-8">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold">Brief Maker</h1>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 