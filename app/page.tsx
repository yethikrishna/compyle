import Footer from "@/components/custom/footer";
import { Header } from "@/components/custom/header";
import CallToAction from "@/components/custom/home-cta";
import HomeFeatured from "@/components/custom/home-featured";
import { HomeHero } from "@/components/custom/home-hero";
import { OurProcess } from "@/components/custom/home-process";
import { HomeStats } from "@/components/custom/home-stats";

export default function Home() {
  return (
    <div className="mx-auto w-full">
      <Header />
      <div className="px-6">
        <HomeHero />
        <HomeStats />
        <HomeFeatured />
        <OurProcess />
        <CallToAction />
      </div>
      <Footer />
    </div>
  );
}
