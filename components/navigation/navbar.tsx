"use client";

import { Button } from "@/components/ui/button";
import { PanelLeftIcon, ChevronRight } from "lucide-react";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import Link from "next/link";

function formatSegment(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .slice(1); // remove "dashboard"

  return (
    <div className="h-14 border-b bg-white flex items-center px-4 gap-3">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
        <PanelLeftIcon className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>

        {segments.map((segment, index) => {
          const href = "/dashboard/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          return (
            <span key={href} className="flex items-center">
              <ChevronRight className="mx-2 h-4 w-4" />
              {isLast ? (
                <span className="text-foreground font-medium">
                  {formatSegment(segment)}
                </span>
              ) : (
                <Link href={href as Route<string>} className="hover:text-foreground">
                  {formatSegment(segment)}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
