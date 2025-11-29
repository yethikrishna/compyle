import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="w-full container px-6 mx-auto bg-muted/30 rounded-2xl p-8 md:p-14 mt-24">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Explore What Creators Are Building
        </h2>
        <p className="text-muted-foreground mb-6">
          Discover useful tools built by creators from across the world. Whether
          you&apos;re exploring, comparing, or just curious, Compyle Apps helps
          you find the right app quickly and easily.
        </p>
        <Link href="/apps">
          <Button size="lg" className="px-6 cursor-pointer">
            Get Started
          </Button>
        </Link>
      </div>
    </section>
  );
}
