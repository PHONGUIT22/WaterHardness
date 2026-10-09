import HeroSearchSection from "@/components/home/HeroSearchSection";
import TopRankingGrid from "@/components/home/TopRankingGrid";
import OutcodeDirectory from "@/components/home/OutcodeDirectory";
import { UkHardnessMapSvg } from "@/components/visual";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 1. Hero Search */}
      <HeroSearchSection />

      {/* 2. Interactive UK National Water Hardness Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <UkHardnessMapSvg />
      </section>

      {/* 3. Top Xếp Hạng Độ cứng nước */}
      <TopRankingGrid />

      {/* 4. Danh sách các Outcode tại UK */}
      <OutcodeDirectory />
    </main>
  );
}