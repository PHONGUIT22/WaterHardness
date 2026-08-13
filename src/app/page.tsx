import HeroSearchSection from "@/components/home/HeroSearchSection";
import TopRankingGrid from "@/components/home/TopRankingGrid";
import OutcodeDirectory from "@/components/home/OutcodeDirectory";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 1. Hero Search */}
      <HeroSearchSection />

      {/* 2. Top Xếp Hạng Độ cứng nước */}
      <TopRankingGrid />

      {/* 3. Danh sách các Outcode tại UK */}
      <OutcodeDirectory />
    </main>
  );
}