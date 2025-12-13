import { CallToAction } from "@/components/custom/home-cta";
import { HomeFeatured } from "@/components/custom/home-featured";
import { HomeHero } from "@/components/custom/home-hero";
import { OurProcess } from "@/components/custom/home-process";
import { HomeStats } from "@/components/custom/home-stats";

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeStats />
      <HomeFeatured />
      <OurProcess />
      <CallToAction />
    </>
  );
}
