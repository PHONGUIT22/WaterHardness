import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOutcodeOverviewData, getAllOutcodesFromDB } from "@/lib/data";
import { 
  Droplets, 
  ShieldCheck, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  Building2, 
  ArrowRight, 
  WashingMachine, 
  Info,
  MapPin
} from "lucide-react";
import { getSeoDates } from "@/lib/seoDates";
// 1. BẬT ISR: Cache trang Outcode trên CDN trong 24 tiếng
export const revalidate = 86400; 
export const dynamicParams = true;

// Pre-render tĩnh tất cả các Outcode lúc build web
export async function generateStaticParams() {
  const outcodes = await getAllOutcodesFromDB();
  return outcodes.map((item) => ({
    outcode: item.outcode.toLowerCase(),
  }));
}

interface PageProps {
  params: Promise<{ outcode: string }> | { outcode: string };
}

// 2. TỰ ĐỘNG SINH METADATA SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getOutcodeOverviewData(resolvedParams.outcode);

  if (!data) {
    return {
      title: "Outcode Area Not Found - WaterHardness.uk",
    };
  }

  return {
    title: `Water Hardness in ${data.outcode} (${data.companyName}) - PPM & Appliance Guide`,
    description: `Average water hardness in ${data.outcode} is ${data.avgPpm} PPM (${data.totalSectors} postcode sectors). Check limescale risks, water company details, and dishwasher salt settings for ${data.outcode}.`,
    alternates: {
      canonical: `https://waterhardness.uk/water-hardness/${data.outcode.toLowerCase()}`,
    },
    openGraph: {
      title: `Water Hardness Level in ${data.outcode} - ${data.avgPpm} PPM`,
      description: `Comprehensive water quality analysis for outcode ${data.outcode} supplied by ${data.companyName}.`,
      url: `https://waterhardness.uk/water-hardness/${data.outcode.toLowerCase()}`,
      siteName: "WaterHardness.uk",
      locale: "en_GB",
      type: "article",
    },
  };
}

// 3. MAIN SERVER COMPONENT
export default async function OutcodeHubPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getOutcodeOverviewData(resolvedParams.outcode);

  if (!data) {
    notFound();
  }

  // ==============================================================================
  // 🔥 ENGINE SINH CONTENT DÀY ĐẶN CHỐNG HCU / THIN CONTENT
  // ==============================================================================
  const softestPpm = data.softestSector?.avgPpm || data.avgPpm;
  const hardestPpm = data.hardestSector?.avgPpm || data.avgPpm;
  const softestSectorName = data.softestSector?.sector || data.outcode;
  const hardestSectorName = data.hardestSector?.sector || data.outcode;

  // Xác định phân loại độ cứng tổng quan
  const isSoft = data.avgPpm < 100;
  const isModerate = data.avgPpm >= 100 && data.avgPpm < 200;
  const isHard = data.avgPpm >= 200 && data.avgPpm < 300;

  const hardnessCategoryText = isSoft
    ? "Soft Water"
    : isModerate
    ? "Moderately Hard Water"
    : isHard
    ? "Hard Water"
    : "Very Hard Water";

  // Slug chuẩn của Outcode hiện tại (VD: "ba13")
  const cleanOutcodeSlug = data.outcode.toLowerCase().trim();

  // Spintax Seed cố định cho từng Outcode
  const seed = data.outcode.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const spintax = (options: string[], offset: number = 0) => options[(seed + offset) % options.length];

  // --- ĐOẠN 1: MỞ BÀI TỔNG QUAN XỨ CẤP NƯỚC ---
  const intros = [
    `Analyzing water quality disclosures across all ${data.totalSectors} postcode sectors in outcode ${data.outcode} reveals an average water hardness of ${data.avgPpm} PPM (${hardnessCategoryText}). Public water supply across this area is managed by ${data.companyName}, responsible for treating and delivering water to residential households.`,
    `For residents and businesses in outcode ${data.outcode}, understanding local water chemistry is essential for appliance longevity and limescale prevention. Our environmental data shows that ${data.outcode} averages ${data.avgPpm} PPM in mineral content, falling into the ${hardnessCategoryText} classification.`,
    `Looking for water hardness metrics in ${data.outcode}? Water supplied by ${data.companyName} in this outcode registers a baseline average of ${data.avgPpm} PPM across ${data.totalSectors} distinct postcode sectors.`
  ];
  const outcodeIntro = spintax(intros, 0);

  // --- ĐOẠN 2: PHÂN TÍCH ĐỘ CHÊNH LỆCH ĐỘ CỨNG NƯỚC TRONG KHU VỰC ---
  const disparityText = `Water chemistry can fluctuate across supply zones in ${data.outcode}. The lowest mineral concentration is recorded in sector ${softestSectorName} at ${softestPpm} PPM, whereas sector ${hardestSectorName} experiences higher mineral levels reaching ${hardestPpm} PPM.`;

  // --- ĐOẠN 3: LỜI KHUYÊN CÀI ĐẶT THIẾT BỊ GIA ĐÌNH ---
  const applianceAdvice = isSoft
    ? `Since ${data.outcode} enjoys soft water (${data.avgPpm} PPM), residents generally do not need dishwasher salt or heavy-duty limescale descalers. Standard detergent dosages are sufficient for laundry and dishwashing.`
    : `Due to the ${hardnessCategoryText.toLowerCase()} (${data.avgPpm} PPM) in ${data.outcode}, limescale build-up can occur on heating elements, shower heads, and boilers. Setting your dishwasher water softener to the correct level (e.g. Bosch setting ${data.hardestSector?.boschSaltSetting || "H04"}) is strongly recommended to prevent cloudy glassware and internal scale accumulation.`;
  const { datePublishedISO, dateModifiedISO, dateModifiedFormatted } = getSeoDates(data.outcode);

  // --- ĐOẠN 4: SCHEMA CHUẨN EEAT CHO TRANG HUB ---
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": `Water Hardness Report & Appliance Guide for ${data.outcode}`,
        "description": `Comprehensive water quality overview across ${data.totalSectors} postcode sectors in ${data.outcode} supplied by ${data.companyName}.`,
        "author": { "@id": "https://waterhardness.uk/#person" },
        "publisher": { "@id": "https://waterhardness.uk/#organization" },
        "datePublished": datePublishedISO,
        "dateModified": dateModifiedISO
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Is water hard in outcode ${data.outcode}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Water in ${data.outcode} averages ${data.avgPpm} PPM, which is categorized as ${hardnessCategoryText}. Water in this area is supplied by ${data.companyName}.`
            }
          },
          {
            "@type": "Question",
            "name": `Who is the water supplier for ${data.outcode}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Public water service in outcode ${data.outcode} is provided by ${data.companyName}.`
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* HERO SECTION CỦA OUTCODE */}
      <section className="bg-slate-900 text-white pt-16 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center sm:text-left">
          
          <div className="inline-flex items-center gap-2 bg-slate-800 text-cyan-400 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" /> UK Water Quality Report • 2026 Data
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
            <div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase">
                Water Hardness in <span className="text-cyan-400">{data.outcode}</span>
              </h1>
              <p className="text-slate-400 mt-3 text-base sm:text-lg max-w-2xl">
                Water supply analysis across {data.totalSectors} postcode sectors in {data.outcode} ({data.companyName}).
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shrink-0 text-center sm:text-right">
              <span className="text-slate-400 text-xs font-medium block uppercase tracking-wider">
                Outcode Avg Hardness
              </span>
              <span className="text-4xl sm:text-5xl font-black text-cyan-400 block mt-1">
                {data.avgPpm}
                <span className="text-xs font-normal text-slate-400"> PPM</span>
              </span>
              <span className="text-xs font-bold text-slate-300 block mt-1">
                {hardnessCategoryText}
              </span>
            </div>
          </div>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        
        {/* SEO ARTICLE (SEO ENGINE CHỐNG THIN CONTENT) */}
        <article className="prose prose-slate max-w-none text-slate-700 mb-12 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm leading-relaxed text-base sm:text-lg space-y-4">
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> Regional Quality Overview
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-3">
            Water Supply Analysis: Outcode {data.outcode}
          </h2>
          <p>{outcodeIntro}</p>
          <p>{disparityText}</p>
          <p>{applianceAdvice} Review the individual postcode sectors below to get precise dishwasher salt settings and limescale recommendations.</p>

          {/* Dòng xác nhận tác giả EEAT */}
          <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
            <span>
              Environmental analysis verified by{" "}
              <Link href="/about" className="font-bold text-slate-900 hover:text-cyan-600 underline">
                Nguyễn Hạc Phong
              </Link>
            </span>
            <Link href="/about" className="text-cyan-600 font-bold hover:underline">
              View Data Methodology & WSZ Sources →
            </Link>
          </div>
        </article>

        {/* HIGHLIGHT: SECTOR MỀM NHẤT VS CỨNG NHẤT */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* SECTOR MỀM NHẤT */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Softest Sector in {data.outcode}</h2>
                  <p className="text-xs text-slate-500">Lowest mineral concentration</p>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                Softest
              </span>
            </div>

            {data.softestSector && (
              /* 👉 FIX: DÙNG LINK 2 CẤP chuẩn /water-hardness/ba13/ba13-2 */
              <Link
                href={`/water-hardness/${cleanOutcodeSlug}/${data.softestSector.sector.toLowerCase().trim().replace(/\s+/g, "-")}`}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50/60 rounded-2xl transition-colors border border-slate-200/60 group"
              >
                <div>
                  <span className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors block">
                    Sector {data.softestSector.sector}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {data.softestSector.postcodeCount} Postcodes • {data.softestSector.hardnessCategory}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 text-lg block">{data.softestSector.avgPpm} PPM</span>
                  <span className="text-xs font-semibold text-emerald-600 block">{data.softestSector.clarkDegrees} °Clark</span>
                </div>
              </Link>
            )}
          </div>

          {/* SECTOR CỨNG NHẤT */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Hardest Sector in {data.outcode}</h2>
                  <p className="text-xs text-slate-500">Highest mineral concentration</p>
                </div>
              </div>
              <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                Highest Hardness
              </span>
            </div>

            {data.hardestSector && (
              /* 👉 FIX: DÙNG LINK 2 CẤP chuẩn /water-hardness/ba13/ba13-9 */
              <Link
                href={`/water-hardness/${cleanOutcodeSlug}/${data.hardestSector.sector.toLowerCase().trim().replace(/\s+/g, "-")}`}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl transition-colors border border-slate-200/60 group"
              >
                <div>
                  <span className="font-bold text-slate-900 text-base group-hover:text-amber-700 transition-colors block">
                    Sector {data.hardestSector.sector}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {data.hardestSector.postcodeCount} Postcodes • {data.hardestSector.hardnessCategory}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 text-lg block">{data.hardestSector.avgPpm} PPM</span>
                  <span className="text-xs font-semibold text-amber-600 block">{data.hardestSector.clarkDegrees} °Clark</span>
                </div>
              </Link>
            )}
          </div>

        </section>

        {/* DANH SÁCH TẤT CẢ SECTOR TRONG OUTCODE (GRID ĐI INTERNAL LINK) */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
              <Building2 className="w-6 h-6 text-cyan-600" /> All Postcode Sectors in {data.outcode}
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Select a postcode sector below to view exact water softener salt settings, limescale protection guides, and appliance recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.sectorsList.map((item) => {
              const sectorSlug = item.sector.toLowerCase().trim().replace(/\s+/g, "-");
              return (
                /* 👉 FIX: DÙNG LINK 2 CẤP chuẩn /water-hardness/ba13/ba13-3 */
                <Link
                  key={item.sector}
                  href={`/water-hardness/${cleanOutcodeSlug}/${sectorSlug}`}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-cyan-50 border border-slate-200/60 hover:border-cyan-300 transition-all flex items-center justify-between group"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-slate-900 group-hover:text-cyan-700 transition-colors text-sm block truncate">
                      Sector {item.sector}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Droplets className="w-3 h-3 text-cyan-600 shrink-0" />
                      {item.avgPpm} PPM ({item.hardnessCategory})
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-600 shrink-0 transition-colors" />
                </Link>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}