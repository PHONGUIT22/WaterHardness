import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSectorData } from "@/lib/data";
import CompareHero from "@/components/compare/CompareHero";
import VersusTable from "@/components/compare/VersusTable";
import { Sparkles } from "lucide-react";
import { getSeoDates } from "@/lib/seoDates";

export const revalidate = 86400;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ pair: string }> | { pair: string };
}

// Helper tách 2 Sector từ Pair Slug (VD: sw1a-1-vs-ab10-1 -> [SW1A 1, AB10 1])
function parsePairSlug(pairSlug: string) {
  const parts = pairSlug.split("-vs-");
  if (parts.length !== 2) return null;

  const sectorA = parts[0].replace(/-/g, " ").trim().toUpperCase();
  const sectorB = parts[1].replace(/-/g, " ").trim().toUpperCase();

  if (!sectorA || !sectorB) return null;

  return { sectorA, sectorB, slugA: parts[0], slugB: parts[1] };
}

// 1. GENERATE DYNAMIC METADATA
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const parsed = parsePairSlug(resolvedParams.pair);

  if (!parsed) return { title: "Comparison Not Found - WaterHardness.uk" };

  const [dataA, dataB] = await Promise.all([
    getSectorData(parsed.sectorA),
    getSectorData(parsed.sectorB),
  ]);

  if (!dataA || !dataB) return { title: "Comparison Not Found - WaterHardness.uk" };

  return {
    title: `${dataA.sector} vs ${dataB.sector} Water Hardness`,
    description: `Compare tap water hardness: Sector ${dataA.sector} (${dataA.avgPpm} PPM) vs Sector ${dataB.sector} (${dataB.avgPpm} PPM). Check limescale risks & appliance settings.`,
    alternates: {
      canonical: `https://waterhardness.uk/compare/${resolvedParams.pair}`,
    },
    openGraph: {
      title: `${dataA.sector} vs ${dataB.sector} Water Hardness`,
      description: `Compare tap water hardness: Sector ${dataA.sector} (${dataA.avgPpm} PPM) vs Sector ${dataB.sector} (${dataB.avgPpm} PPM).`,
      url: `https://waterhardness.uk/compare/${resolvedParams.pair}`,
      siteName: "WaterHardness.uk",
      locale: "en_GB",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${dataA.sector} vs ${dataB.sector} Water Hardness`,
      description: `Compare water hardness between Sector ${dataA.sector} and Sector ${dataB.sector}.`,
    },
  };
}

// 2. MAIN SERVER COMPONENT
export default async function CompareDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const parsed = parsePairSlug(resolvedParams.pair);

  if (!parsed) return notFound();

  const [dataA, dataB] = await Promise.all([
    getSectorData(parsed.sectorA),
    getSectorData(parsed.sectorB),
  ]);

  if (!dataA || !dataB) return notFound();

  // ==============================================================================
  // 🔥 ENGINE PHÂN TÍCH SO SÁNH TỰ ĐỘNG (CHỐNG THIN CONTENT)
  // ==============================================================================
  const ppmDiff = Math.abs(dataA.avgPpm - dataB.avgPpm);
  const isASofter = dataA.avgPpm <= dataB.avgPpm;

  const softerSector = isASofter ? dataA : dataB;
  const harderSector = isASofter ? dataB : dataA;

  const summaryParagraph1 = `Comparing tap water mineral concentration between Sector ${dataA.sector} (${dataA.companyName}) and Sector ${dataB.sector} (${dataB.companyName}) reveals a water hardness difference of ${ppmDiff} PPM. Sector ${softerSector.sector} has softer water at ${softerSector.avgPpm} PPM (${softerSector.hardnessCategory}) compared to Sector ${harderSector.sector} at ${harderSector.avgPpm} PPM (${harderSector.hardnessCategory}).`;

  const summaryParagraph2 = `Limescale risk and boiler heating efficiency vary based on these mineral levels. Households in Sector ${harderSector.sector} experience higher heating element degradation and kettle scale accumulation due to elevated calcium carbonate density (${harderSector.avgPpm} PPM vs ${softerSector.avgPpm} PPM).`;

  const summaryParagraph3 = `For home appliance setup, Bosch dishwasher water softener settings should be calibrated accordingly: Sector ${dataA.sector} requires setting ${dataA.boschSaltSetting || "H00"} whereas Sector ${dataB.sector} recommends setting ${dataB.boschSaltSetting || "H00"}.`;
  const { datePublishedISO, dateModifiedISO, dateModifiedFormatted } = getSeoDates(resolvedParams.pair);
  // 3. SCHEMA JSON-LD CHUẨN EEAT & FAQ
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": `Water Hardness Comparison: Sector ${dataA.sector} vs Sector ${dataB.sector}`,
        "description": `Side-by-side water quality and hardness comparison between Sector ${dataA.sector} and Sector ${dataB.sector}.`,
        "author": { "@id": "https://waterhardness.uk/#person" },
        "publisher": { "@id": "https://waterhardness.uk/#organization" },
        "datePublished": datePublishedISO,
        "dateModified": dateModifiedISO,
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Which area has harder water: Sector ${dataA.sector} or Sector ${dataB.sector}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Sector ${harderSector.sector} has harder water at ${harderSector.avgPpm} PPM compared to Sector ${softerSector.sector} at ${softerSector.avgPpm} PPM (a difference of ${ppmDiff} PPM).`,
            },
          },
          {
            "@type": "Question",
            "name": `What are the Bosch dishwasher salt settings for ${dataA.sector} vs ${dataB.sector}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Bosch dishwashers should be set to ${dataA.boschSaltSetting || "H00"} in Sector ${dataA.sector} and ${dataB.boschSaltSetting || "H00"} in Sector ${dataB.sector}.`,
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://waterhardness.uk" },
          { "@type": "ListItem", "position": 2, "name": "Compare", "item": "https://waterhardness.uk/compare" },
          { "@type": "ListItem", "position": 3, "name": `${dataA.sector} vs ${dataB.sector}`, "item": `https://waterhardness.uk/compare/${resolvedParams.pair}` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* SEARCH HERO */}
      <CompareHero locA={dataA.sector} locB={dataB.sector} dataA={dataA} dataB={dataB} />

      <div className="max-w-5xl mx-auto px-4 -mt-6">
        
        {/* SEO TEXT ARTICLE PHÂN TÍCH SO SÁNH */}
        <article className="prose prose-slate max-w-none text-slate-700 mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm leading-relaxed text-base sm:text-lg space-y-4">
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> Water Quality Comparison Analysis
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-3">
            Executive Summary: Sector {dataA.sector} vs Sector {dataB.sector}
          </h2>
          <p>{summaryParagraph1}</p>
          <p>{summaryParagraph2}</p>
          <p>{summaryParagraph3}</p>
        </article>

        {/* KHỐI TÁC GIẢ EEAT */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 mb-8 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-cyan-400 rounded-full flex items-center justify-center font-black text-sm shrink-0 border border-slate-800">
              NP
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Comparative Analysis Verified</span>
              <Link href="/about" className="font-bold text-slate-900 hover:text-cyan-600 transition-colors text-sm">
                Nguyễn Hạc Phong <span className="text-slate-400 font-normal text-xs">• Founder & Data Engineer</span>
              </Link>
            </div>
          </div>
          <Link href="/about" className="text-cyan-600 font-bold hover:underline hidden sm:inline text-xs">
            Data Methodology & Sources →
          </Link>
        </div>

        {/* BẢNG SO SÁNH CHI TIẾT */}
        <VersusTable dataA={dataA} dataB={dataB} />
      </div>
    </div>
  );
}