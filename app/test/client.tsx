"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

export default function AppDetailClient({
  commentId,
  initialLikes,
}: {
  commentId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <Heart
        className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
      />
      {likes}
    </button>
  );
}
