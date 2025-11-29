import { Asterisk, CornerDownRight } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const OurProcess = () => {
  const process = [
    {
      step: "01",
      title: "Imagine & Build",
      description:
        "Start by shaping your idea inside Compyle AI. Explore concepts, generate prototypes, and turn your imagination into something real.",
    },
    {
      step: "02",
      title: "Share on Compyle Apps",
      description:
        "Publish your creation to the Compyle Apps showcase. Let others explore, interact with, and discover what you've built.",
    },
    {
      step: "03",
      title: "Engage the Community",
      description:
        "Gather feedback, connect with other creators, and let the community help your idea evolve. Collaboration is fuel.",
    },
    {
      step: "04",
      title: "Improve & Grow",
      description:
        "Refine your project with insights and suggestions. Iterate, enhance, and expand your idea into something remarkable.",
    },
  ];

  return (
    <section className="mt-52">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-6 lg:gap-20">
          <div className="top-10 col-span-2 h-fit w-fit gap-3 space-y-7 py-8 lg:sticky">
            <div className="relative w-fit text-5xl font-semibold tracking-tight lg:text-7xl">
              {" "}
              <h1 className="w-fit">Our Process</h1>
              <Asterisk className="absolute -right-2 -top-2 size-5 text-orange-500 md:size-10 lg:-right-14" />
            </div>
            <p className="text-foreground/50 text-base">
              From idea to impact, Compyle guides creators through a clear
              journey. You imagine, you build, you share, and the community
              helps your work grow. This is how ideas evolve into living
              projects.
            </p>

            <Link href="https://www.compyle.ai" target="_blank">
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-2 cursor-pointer"
              >
                <CornerDownRight className="text-orange-500" />
                Try Compyle.ai
              </Button>
            </Link>
          </div>
          <ul className="lg:pl-22 relative col-span-4 w-full">
            {process.map((step, index) => (
              <li
                key={index}
                className="relative flex flex-col justify-between gap-10 border-t py-8 md:flex-row lg:py-10"
              >
                <Illustration className="absolute right-0 top-4" />

                <div className="bg-muted flex size-12 items-center justify-center px-4 py-1 tracking-tighter">
                  0{index + 1}
                </div>
                <div className="">
                  <h3 className="mb-4 text-2xl font-semibold tracking-tighter lg:text-3xl">
                    {step.title}
                  </h3>
                  <p className="text-foreground/50">{step.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const Illustration = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <line
        x1="0.607422"
        y1="2.57422"
        x2="21.5762"
        y2="2.57422"
        stroke="#FF0000"
        strokeWidth="4"
      />
      <line
        x1="19.5762"
        y1="19.624"
        x2="19.5762"
        y2="4.57422"
        stroke="#FF0000"
        strokeWidth="4"
      />
    </svg>
  );
};
