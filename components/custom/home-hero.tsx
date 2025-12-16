"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/session.store";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HomeHero() {
  const { authInfo } = useAuthStore();

  return (
    <section>
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <Link href="https://www.compyle.ai" target="_blank">
            <Badge variant="outline">
              ✨ Try Compyle.ai
              <ArrowUpRight className="ml-2 size-4" />
            </Badge>
          </Link>
          <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
            Apps Built With Compyle.ai
          </h1>
          <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
            Discover incredible applications built with Compyle. From
            productivity tools to creative platforms, explore what builders are
            creating.
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
            {authInfo?.session ? (
              <Button asChild className="w-full sm:w-auto">
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-full sm:w-auto">
                <Link href="/login">
                  Get Started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}

            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/apps">View Submissions</Link>
            </Button>
          </div>
        </div>
        <Image
          width={500}
          height={500}
          loading="eager"
          src="/hero.png"
          alt="Compyle landing image"
          className="max-h-96 w-full rounded-md object-cover"
        />
      </div>
    </section>
  );
}
