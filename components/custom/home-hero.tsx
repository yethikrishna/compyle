import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HomeHero = ({
  badge = "✨ Try Compyle.ai",
  heading = "Apps Built With Compyle.ai",
  description = "Discover incredible AI-powered applications built with Compyle. From productivity tools to creative platforms, explore what builders are creating.",
  buttons = {
    primary: {
      text: "View Submited Apps",
      url: "/apps",
    },
    // secondary: {
    //   text: "Competitions",
    //   url: "/competitions",
    // },
  },
}) => {
  return (
    <section className="py-24">
      <div className="container mx-auto">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {badge && (
              <Link href="https://www.compyle.ai" target="_blank">
                <Badge variant="outline">
                  {badge}
                  <ArrowUpRight className="ml-2 size-4" />
                </Badge>
              </Link>
            )}
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              {heading}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button className="w-full sm:w-auto">
                  <Link href={buttons.primary.url}>{buttons.primary.text}</Link>
                  <ArrowRight className="size-4" />
                </Button>
              )}
              {/*{buttons.secondary && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={buttons.secondary.url}>
                    {buttons.secondary.text}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}*/}
            </div>
          </div>
          <Image
            width={500}
            height={500}
            loading="eager"
            src="/compyle.png"
            alt="Compyle landing image"
            className="max-h-96 w-full rounded-md object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export { HomeHero };
