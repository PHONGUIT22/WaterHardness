import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOutcodeOverviewData, getAllOutcodesFromDB } from "@/lib/data";
import { getSeoDates } from "@/lib/seoDates";
import { 
  Droplets, 
  ShieldCheck, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  Building2, 
  ArrowRight, 
  Scale
} from "lucide-react";

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

// 2. TỰ ĐỘNG SINH METADATA SEO TĂNG CTR (CÓ EMOJI 💧 & TIÊU ĐỀ NGẮN GỌN)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getOutcodeOverviewData(resolvedParams.outcode);

  if (!data) {
    return {
      title: "Outcode Area Not Found - WaterHardness.uk",
    };
  }

  const hardnessCategory = data.avgPpm < 100 ? "Soft Water" : data.avgPpm < 200 ? "Moderately Hard" : "Hard Water";

  return {
    title: `Outcode ${data.outcode} Water Hardness: ${data.avgPpm} PPM | Quality Report`,
    description: `💧 Analyzing ${data.totalSectors} sectors in ${data.outcode} (${data.companyName}). Average hardness is ${data.avgPpm} PPM (${hardnessCategory}). Check limescale risks & dishwasher settings.`,
    alternates: {
      canonical: `https://waterhardness.uk/water-hardness/${data.outcode.toLowerCase()}`,
    },
    openGraph: {
      title: `Water Hardness in ${data.outcode}: ${data.avgPpm} PPM (${data.companyName})`,
      description: `Detailed water quality report for outcode ${data.outcode}. View softest vs hardest sectors and appliance salt settings.`,
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
  // 🔥 ENGINE SINH CONTENT DÀY ĐẶN CAO CẤP CHỐNG HCU / THIN CONTENT (V3)
  // ==============================================================================
  const softestPpm = data.softestSector?.avgPpm || data.avgPpm;
  const hardestPpm = data.hardestSector?.avgPpm || data.avgPpm;
  const softestSectorName = data.softestSector?.sector || data.outcode;
  const hardestSectorName = data.hardestSector?.sector || data.outcode;

  // Tính tổng số lượng Postcode thực tế trong toàn bộ Outcode để làm biến Unique
  const totalPostcodes = data.sectorsList.reduce(
    (sum, item) => sum + (item.postcodeCount || 0),
    0
  );

  // Phân loại độ cứng
  const isSoft = data.avgPpm < 100;
  const isModerate = data.avgPpm >= 100 && data.avgPpm < 200;
  const isHard = data.avgPpm >= 200;
  
  // Kiểm tra case Data Phẳng (VD: Scotland/Wales - Số PPM softest và hardest bằng nhau)
  const isFlatData = softestPpm === hardestPpm;

  const hardnessCategoryText = isSoft
    ? "Soft Water"
    : isModerate
    ? "Moderately Hard Water"
    : "Hard Water";

  const cleanOutcodeSlug = data.outcode.toLowerCase().trim();

  // Spintax Seed tất định cho từng Outcode
  const seed = data.outcode.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const spintax = (options: string[], offset: number = 0) => options[(seed + offset) % options.length];

  // --- ĐOẠN 1: MỞ BÀI TỔNG QUAN XỨ CẤP NƯỚC (NHÚNG totalPostcodes UNIQUE) ---
  const intros = [
    `Analyzing official water quality disclosures across all ${data.totalSectors} postcode sectors (encompassing ${totalPostcodes.toLocaleString()} active postcodes) in outcode ${data.outcode} reveals an average water hardness rating of ${data.avgPpm} PPM (${hardnessCategoryText}). Public water supply throughout this regional catchment is treated and distributed by ${data.companyName}.`,
    `For households and local businesses operating across the ${totalPostcodes.toLocaleString()} postcodes in outcode ${data.outcode}, understanding municipal water chemistry is essential for appliance maintenance and energy conservation. Environmental data confirms that water supplied by ${data.companyName} in ${data.outcode} averages ${data.avgPpm} PPM in dissolved mineral content.`,
    `Looking for reliable tap water metrics in outcode ${data.outcode}? Covering ${data.totalSectors} distinct postal sectors, public water delivered by ${data.companyName} maintains a baseline average of ${data.avgPpm} PPM of dissolved calcium carbonate.`,
    `Environmental compliance reports for outcode ${data.outcode} indicate a ${hardnessCategoryText.toLowerCase()} classification. Serving a total of ${totalPostcodes.toLocaleString()} postcodes, the public network managed by ${data.companyName} delivers water averaging ${data.avgPpm} PPM in mineral density.`
  ];
  const outcodeIntro = spintax(intros, 0);

  // --- ĐOẠN 2: PHÂN TÍCH ĐỘ CHÊNH LỆCH (XỬ LÝ THÔNG MINH DATA PHẲNG KHÔNG BỊ NGỚ NGẨN) ---
  const disparityTemplates = isFlatData ? [
    `Water chemistry remains exceptionally uniform across all ${data.totalSectors} sectors within outcode ${data.outcode}. Data confirms a consistent mineral concentration of ${data.avgPpm} PPM throughout the entire supply zone, indicating a single primary water source managed by ${data.companyName}.`,
    `Unlike metropolitan areas that blend multiple water sources, all ${totalPostcodes.toLocaleString()} postcodes in outcode ${data.outcode} share an identical hardness profile. Every sector in this area consistently tests at ${data.avgPpm} PPM, providing predictable water quality for all residents.`,
    `Municipal disclosures show zero mineral variance across outcode ${data.outcode}. From sector ${softestSectorName} to sector ${hardestSectorName}, the public water supply maintains an unvarying baseline of ${data.avgPpm} PPM (${hardnessCategoryText}).`
  ] : [
    `Water chemistry fluctuates across individual supply zones within outcode ${data.outcode}. The lowest mineral density is recorded in sector ${softestSectorName} at ${softestPpm} PPM, whereas sector ${hardestSectorName} experiences higher calcium carbonate concentrations reaching ${hardestPpm} PPM.`,
    `Within outcode ${data.outcode}, limescale risks vary depending on neighborhood catchment feeds. Sector ${hardestSectorName} represents the hardest water area at ${hardestPpm} PPM, while residents in sector ${softestSectorName} benefit from softer supply at ${softestPpm} PPM.`,
    `Comparing local sectors in ${data.outcode} reveals a mineral variance of ${hardestPpm - softestPpm} PPM. While sector ${softestSectorName} registers ${softestPpm} PPM, sector ${hardestSectorName} peaks at ${hardestPpm} PPM, requiring slightly higher dishwasher salt dosage.`
  ];
  const disparityText = spintax(disparityTemplates, 1);

  // --- ĐOẠN 3: LỜI KHUYÊN CÀI ĐẶT THIẾT BỊ GIA ĐÌNH ---
  const applianceTemplates = isSoft ? [
    `Since outcode ${data.outcode} enjoys naturally soft water (${data.avgPpm} PPM), residents across its ${totalPostcodes.toLocaleString()} postcodes generally do not require heavy-duty limescale descalers or dishwasher regeneration salt. Standard laundry detergent doses are sufficient for daily washing.`,
    `With a low mineral footprint (${data.avgPpm} PPM) delivered by ${data.companyName}, households in ${data.outcode} face minimal limescale build-up on boiler heating elements. Dishwasher water softener settings can safely be kept at zero or lowest default levels.`
  ] : [
    `Due to the ${hardnessCategoryText.toLowerCase()} (${data.avgPpm} PPM) delivered across ${data.outcode}, limescale accumulation can occur on boiler heat exchangers, shower heads, and kettle elements. Calibrating dishwasher water softeners to handle ${data.avgPpm} PPM is strongly advised to prevent glass clouding.`,
    `To protect home appliances across the ${data.totalSectors} sectors of ${data.outcode}, proactive limescale management is recommended. Correctly setting dishwasher salt dosage according to ${data.companyName}&apos;s ${data.avgPpm} PPM rating extends internal pump lifespans and prevents white mineral film on dishes.`
  ];
  const applianceAdvice = spintax(applianceTemplates, 2);

  // Ngày cập nhật SEO đồng bộ
  const { datePublishedISO, dateModifiedISO, dateModifiedFormatted } = getSeoDates(data.outcode);

  // --- SCHEMA CHUẨN EEAT CHO TRANG HUB ---
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": `Water Hardness Report & Quality Analysis for ${data.outcode}`,
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
              "text": `Water in ${data.outcode} averages ${data.avgPpm} PPM, which is categorized as ${hardnessCategoryText}. Public supply in this area is managed by ${data.companyName}.`
            }
          },
          {
            "@type": "Question",
            "name": `Who is the official water supplier for outcode ${data.outcode}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Public water service across outcode ${data.outcode} is provided by ${data.companyName}.`
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
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> UK Water Quality Report • 2026 Data
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
            <div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase">
                Water Hardness in <span className="text-cyan-400">{data.outcode}</span>
              </h1>
              <p className="text-slate-400 mt-3 text-base sm:text-lg max-w-2xl">
                Water supply analysis across {data.totalSectors} postcode sectors ({totalPostcodes.toLocaleString()} postcodes) in {data.outcode} ({data.companyName}).
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
        <article className="prose prose-slate max-w-none text-slate-700 mb-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm leading-relaxed text-base sm:text-lg space-y-4">
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
              Updated: <strong>{dateModifiedFormatted}</strong> • Verified by{" "}
              <Link href="/about" className="font-bold text-slate-900 hover:text-cyan-600 underline">
                Nguyễn Hạc Phong
              </Link>
            </span>
            <Link href="/about" className="text-cyan-600 font-bold hover:underline">
              View Data Methodology & WSZ Sources →
            </Link>
          </div>
        </article>

        {/* 🔥 INTERNAL LINKING CROSS-LINKING ĐẨY TRAFFIC CHO TRANG COMPARE */}
        {data.hardestSector && (
          <div className="mb-12 bg-cyan-50 p-6 sm:p-8 rounded-3xl border border-cyan-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-cyan-700 font-bold text-xs uppercase tracking-wider mb-1">
                <Scale className="w-4 h-4" /> Compare Water Hardness
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Curious how outcode {data.outcode} compares?</h3>
              <p className="text-sm text-slate-600 mt-0.5">
                See how the hardest area in {data.outcode} (Sector {data.hardestSector.sector}) stacks up against central London water supply.
              </p>
            </div>
            <Link 
              href={`/compare/${data.hardestSector.sector.toLowerCase().replace(/\s+/g, "-")}-vs-sw1a-1`} 
              className="bg-slate-900 hover:bg-cyan-600 text-white px-6 py-3.5 rounded-2xl text-sm font-bold transition-all shrink-0 cursor-pointer shadow-xs flex items-center gap-2"
            >
              <span>Compare vs London (SW1A 1)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

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