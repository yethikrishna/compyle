import { Button } from "@/components/ui/button";
import { GitPullRequestCreateArrow } from "lucide-react";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="w-full container px-6 mx-auto bg-muted/30 rounded-2xl p-0 overflow-hidden mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="bg-muted/40 flex items-center justify-center p-12 md:p-0">
          <GitPullRequestCreateArrow size={50} />
        </div>

        <div className="p-8 md:p-14 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore What Creators Are Building
          </h2>

          <p className="text-muted-foreground mb-6 max-w-md">
            Discover useful tools built by creators from across the world.
            Whether you’re exploring, comparing, or just curious, Compyle Apps
            helps you find the right app quickly and easily.
          </p>

          <Link href="/apps">
            <Button size="lg" className="px-6 cursor-pointer">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
