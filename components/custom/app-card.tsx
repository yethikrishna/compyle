"use client";

import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import Link from "next/link";

export interface AppCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  upvotes: number;
}

export default function AppCard({ app }: { app: AppCardProps }) {
  return (
    <Link href={`/apps/${app.id}`}>
      <div className="h-full p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 group cursor-pointer">
        {/* Image Placeholder */}
        <div className="w-full h-40 rounded-lg bg-linear-to-br from-primary/30 via-secondary/20 to-accent/30 mb-4 overflow-hidden group-hover:from-primary/40 group-hover:via-secondary/30 group-hover:to-accent/40 transition-all"></div>

        <div className="mb-3">
          <Badge
            variant="outline"
            className="rounded-xs uppercase text-primary"
          >
            {app.category}
          </Badge>
        </div>

        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors truncate">
          {app.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {app.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1"></div>
          <div className="flex items-center gap-1 text-muted-foreground"></div>
          <div className="flex gap-5">
            <p className="text-foreground/50">upvotes</p>
            <Heart className="text-destructive fill-destructive size-5 mt-0.5 -mr-3" />
            <p className="text-foreground/50">{app.upvotes}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
