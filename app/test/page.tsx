import {
  Heart,
  MessageCircle,
  ExternalLink,
  Github,
  Globe,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import AppDetailClient from "./client";

// Demo data
const demoApp = {
  id: "1",
  name: "TaskFlow Pro",
  slug: "taskflow-pro",
  description:
    "An AI-powered task management app that automatically prioritizes your work and suggests optimal workflows based on your productivity patterns.",
  coverImage: "/placeholder.svg?key=vv1rw",
  websiteUrl: "https://taskflow.dev",
  repoUrl: "https://github.com/taskflow/pro",
  demoUrl: "https://demo.taskflow.dev",
  category: "Productivity",
  builtWith: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Drizzle ORM"],
  featured: true,
  verified: true,
  likes: 2847,
  status: "published",
  createdAt: "2025-01-15",
  user: {
    id: "user-1",
    name: "Sarah Chen",
    email: "sarah@taskflow.dev",
    image: "/placeholder.svg?key=gg0fk",
    role: "creator",
  },
};

const demoComments = [
  {
    id: "comment-1",
    content:
      "This is exactly what I needed! The AI suggestions have saved me hours on planning.",
    likes: 245,
    createdAt: "2025-01-20",
    user: {
      id: "user-2",
      name: "Alex Rodriguez",
      image: "/placeholder.svg?key=jjppd",
    },
    replies: 3,
  },
  {
    id: "comment-2",
    content:
      "Amazing work on the UI! Really smooth animations and great attention to detail.",
    likes: 128,
    createdAt: "2025-01-19",
    user: {
      id: "user-3",
      name: "Jordan Lee",
      image: "/placeholder.svg?key=o2ygd",
    },
    replies: 1,
  },
  {
    id: "comment-3",
    content: "Would love to see mobile sync across all devices.",
    likes: 89,
    createdAt: "2025-01-18",
    user: {
      id: "user-4",
      name: "Morgan Smith",
      image: "/placeholder.svg?key=z6j3j",
    },
    replies: 2,
  },
];

export default function AppDetailPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary"></div>
              <span className="text-sm font-semibold text-foreground">
                Compyle Showcase
              </span>
            </div>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Cover Image */}
        <div className="mb-8 overflow-hidden rounded-xl border border-border">
          <img
            src={demoApp.coverImage || "/placeholder.svg"}
            alt={demoApp.name}
            className="h-96 w-full object-cover"
          />
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* App Header */}
            <div>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                    {demoApp.name}
                  </h1>
                  <p className="mt-2 text-base text-muted-foreground">
                    {demoApp.description}
                  </p>
                </div>
                {demoApp.verified && (
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    ✓ Verified
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {demoApp.category}
                </span>
                {demoApp.builtWith.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div className="flex flex-wrap gap-3 border-t border-b border-border py-6">
              {demoApp.demoUrl && (
                <Button variant="default" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  View Demo
                </Button>
              )}
              {demoApp.websiteUrl && (
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Visit Site
                </Button>
              )}
              {demoApp.repoUrl && (
                <Button variant="outline" size="sm" className="gap-2">
                  <Github className="h-4 w-4" />
                  Source Code
                </Button>
              )}
            </div>

            {/* Comments Section */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Comments ({demoComments.length})
              </h2>

              {/* Add Comment Form */}
              <div className="mb-8 rounded-lg border border-border bg-card p-4">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src="/placeholder.svg?key=lgul8" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Share your thoughts..."
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {demoComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-border pb-6 last:border-b-0"
                  >
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage
                          src={comment.user.image || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {comment.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-foreground text-sm">
                            {comment.user.name}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {comment.createdAt}
                          </span>
                        </div>
                        <p className="mb-3 text-sm text-foreground text-pretty">
                          {comment.content}
                        </p>

                        <div className="flex items-center gap-4">
                          <AppDetailClient
                            commentId={comment.id}
                            initialLikes={comment.likes}
                          />
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            Reply
                          </button>
                          {comment.replies > 0 && (
                            <button className="text-xs font-semibold text-primary hover:underline">
                              {comment.replies}{" "}
                              {comment.replies === 1 ? "reply" : "replies"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upvote Card */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 text-center">
                <div className="text-4xl font-bold text-foreground">
                  {demoApp.likes}
                </div>
                <p className="text-xs text-muted-foreground mt-1">upvotes</p>
              </div>
              <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                <Heart className="h-5 w-5" />
                Upvote
              </button>
            </div>

            {/* Creator Info */}
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Created by
              </p>
              <div className="flex flex-col items-center text-center">
                <Avatar className="mb-3 h-16 w-16">
                  <AvatarImage src={demoApp.user.image || "/placeholder.svg"} />
                  <AvatarFallback>{demoApp.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-foreground text-lg">
                  {demoApp.user.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {demoApp.user.email}
                </p>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  View Profile
                </Button>
              </div>
            </div>

            {/* App Stats */}
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Details
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-foreground capitalize">
                    {demoApp.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posted</span>
                  <span className="font-semibold text-foreground">
                    {demoApp.createdAt}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comments</span>
                  <span className="font-semibold text-foreground">
                    {demoComments.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
