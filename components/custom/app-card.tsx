"use client";

import Link from "next/link";
import { Star, Users, ExternalLink } from "lucide-react";
import { Badge } from "../ui/badge";

export interface AppCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
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
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span className="text-sm font-semibold">0.0</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">0</span>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  );
}
