import { Header } from "@/components/custom/header";
import { HomeHero } from "@/components/custom/home-hero";
import { HomeStats } from "@/components/custom/home-stats";

export default function Home() {
  return (
    <div className="mx-auto w-full">
      <Header />
      <div className="px-6">
        <HomeHero />
        <HomeStats />
      </div>
    </div>
  );
}
