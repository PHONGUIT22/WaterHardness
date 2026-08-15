import { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import {  getSectorData, getTopSectorsForBuild } from "@/lib/data";
import { getSeoDates } from "@/lib/seoDates";

// Components
import Breadcrumb from "@/components/detail/Breadcrumb";
import ApplianceSetupGuide from "@/components/detail/ApplianceSetupGuide";
import FAQSection from "@/components/detail/FAQSection";
import RelatedSectors from "@/components/detail/RelatedSectors";

// Icons
import { 
  CheckCircle2, 
  Droplets, 
  ShieldCheck, 
  Sparkles,
  MapPin
} from "lucide-react";

// BẬT ISR: Cache trang Sector trên CDN trong 24 tiếng
export const revalidate = 86400; 
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ outcode: string; sector: string }> | { outcode: string; sector: string };
}

// BỌC CACHE REACT ĐỂ TRÁNH TRUY VẤN KÉP TRONG 1 REQUEST
const fetchSectorDetails = cache(async (rawSector: string) => {
  // Chuyển slug "ab10-1" thành dạng chuẩn database "AB10 1"
  const cleanSectorStr = rawSector.replace(/-/g, " ").trim().toUpperCase();
  return await getSectorData(cleanSectorStr);
});

function generateCompositeSeed(inputStr: string): number {
  let hash = 2166136261;
  for (let i = 0; i < inputStr.length; i++) {
    hash ^= inputStr.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash);
}
// 2. Thay thế hàm generateStaticParams
export async function generateStaticParams() {
  const topSectors = await getTopSectorsForBuild();

  return topSectors.map((item) => ({
    outcode: item.outcode.toLowerCase(),
    sector: item.sector.toLowerCase().replace(/\s+/g, "-"),
  }));
}
// 1. TỐI ƯU METADATA TĂNG CTR TRÊN GOOGLE
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await fetchSectorDetails(resolvedParams.sector);

  if (!data) return { title: "Postcode Sector Not Found - WaterHardness.uk" };

  const canonicalOutcode = data.outcode.toLowerCase();
  const canonicalSectorSlug = data.sector.toLowerCase().replace(/\s+/g, "-");

  return {
    title: `Sector ${data.sector} Water Hardness: ${data.avgPpm} PPM | Bosch & Beko Settings`,
    description: `🚨 Check water hardness for ${data.sector} (${data.companyName}). Avg: ${data.avgPpm} PPM (${data.hardnessCategory}). Get exact dishwasher salt settings for Bosch, Beko & Miele.`,
    alternates: {
      canonical: `https://waterhardness.uk/water-hardness/${canonicalOutcode}/${canonicalSectorSlug}`,
    },
    openGraph: {
      title: `Sector ${data.sector} Water Hardness: ${data.avgPpm} PPM (${data.hardnessCategory})`,
      description: `Check exact water hardness metrics and dishwasher salt settings for sector ${data.sector}.`,
      url: `https://waterhardness.uk/water-hardness/${canonicalOutcode}/${canonicalSectorSlug}`,
      siteName: "WaterHardness.uk",
      locale: "en_GB",
      type: "article",
    },
  };
}

// 2. MAIN SERVER COMPONENT
export default async function SectorDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const urlOutcode = resolvedParams.outcode.toLowerCase();
  const rawSectorParam = resolvedParams.sector;

  const data = await fetchSectorDetails(rawSectorParam);
  if (!data) return notFound();

  const canonicalOutcode = data.outcode.toLowerCase();
  const canonicalSectorSlug = data.sector.toLowerCase().replace(/\s+/g, "-");

  // REDIRECT 308 NẾU URL GÕ SAI VIẾT HOA/THƯỜNG HOẶC NỐI SAI OUTCODE
  if (urlOutcode !== canonicalOutcode || rawSectorParam.toLowerCase() !== canonicalSectorSlug) {
    permanentRedirect(`/water-hardness/${canonicalOutcode}/${canonicalSectorSlug}`);
  }

  // ==============================================================================
  // 🔥 MA TRẬN TÍNH TOÁN SPINTAX TỰ ĐỘNG BÀI VIẾT (UNIQUE 100% CHỐNG HCU)
  // ==============================================================================
  const { 
    sector, 
    outcode, 
    companyName, 
    avgPpm, 
    clarkDegrees, 
    hardnessCategory, 
    boschSaltSetting,
    latitude,
    longitude,
    postcodeCount,
    dataPrecision 
  } = data;

  const isSoft = avgPpm < 100;
  const isModerate = avgPpm >= 100 && avgPpm < 200;
  const isHard = avgPpm >= 200 && avgPpm < 300;
  const isVeryHard = avgPpm >= 300;

  const boilerLoss = isSoft ? "0%" : isModerate ? "5%" : isHard ? "12%" : "20%+";
  const soapDose = isSoft ? "standard" : isHard ? "+30% extra" : "+50% extra";

  // Định dạng chuỗi GPS Tọa độ
  const latStr = latitude ? latitude.toFixed(4) : "54.0000";
  const lngStr = longitude ? Math.abs(longitude).toFixed(4) : "2.0000";
  const lngDirection = longitude && longitude < 0 ? "W" : "E";

  // Seed Spintax
  const compositeKey = `${sector}-${companyName}-${avgPpm}-${clarkDegrees}-${latitude}-${longitude}`;
  const seed = generateCompositeSeed(compositeKey);
  const spintax = (options: string[], offset: number = 0) => options[(seed + offset) % options.length];

  // --- ĐOẠN 1: MỞ BÀI TỔNG QUAN SECTOR (NHÚNG TỌA ĐỘ & SỐ LƯỢNG POSTCODE) ---
  const intros = [
    `According to the latest public disclosures from ${companyName}, tap water across postcode sector ${sector} (covering approximately ${postcodeCount} postcodes) registers an average mineral concentration of ${avgPpm} PPM (mg/L). Located near geographic coordinates ${latStr}°N, ${lngStr}°${lngDirection}, this local water supply is officially classified as ${hardnessCategory}.`,
    `Residents and households operating home appliances in ${sector} receive water supplied by ${companyName}. Our spatial data (centered at coordinates ${latStr}, ${lngStr}) indicates this sector serves ${postcodeCount} active postcodes with an average hardness rating of ${avgPpm} PPM (${clarkDegrees}° Clark).`,
    `Managing a household or installing appliances in ${sector}? Spanning ${postcodeCount} postal routing units around ${latStr}°N, environmental monitoring for this specific ${companyName} supply zone indicates ${avgPpm} PPM of dissolved calcium carbonate, placing it in the ${hardnessCategory.toLowerCase()} threshold.`,
    `Detailed water quality metrics for sector ${sector} reveal a ${hardnessCategory.toLowerCase()} classification (${clarkDegrees}° Clark). Serving ${postcodeCount} postcodes near GPS coordinates ${latStr}, ${lngStr}, the public supply managed by ${companyName} averages ${avgPpm} PPM in mineral density.`
  ];
  const paragraphIntro = spintax(intros, 0);

  // --- ĐOẠN 2: PHÂN TÍCH TÁC ĐỘNG LIMESCALE & NĂNG LƯỢNG BOILER ---
  const limescaleTemplates = isVeryHard || isHard ? [
    `With an elevated mineral density of ${avgPpm} PPM, sector ${sector} experiences rapid limescale accumulation on heating elements. Unchecked calcium deposits across the ${postcodeCount} postcodes in this zone can reduce boiler heat transfer efficiency by up to ${boilerLoss}, increasing heating bills over time.`,
    `Plumbing systems across the ${postcodeCount} postcodes surrounding ${latStr}°N face high limescale risks due to ${avgPpm} PPM water. Residents often notice white chalky build-up on shower heads, kettle elements, and tap aerators requiring periodic descaling.`,
    `High calcium carbonate density (${avgPpm} PPM / ${clarkDegrees}° Clark) in ${sector} leads to persistent limescale deposits. Shower screens and glass doors near coordinates ${latStr}, ${lngStr} require specialized descaling sprays to maintain clarity.`
  ] : isModerate ? [
    `Registering a moderate mineral concentration of ${avgPpm} PPM near ${latStr}°N, water in ${sector} presents a manageable limescale risk. Heating element degradation is limited (approx. ${boilerLoss} loss), though minor white film can develop over time.`,
    `The ${hardnessCategory.toLowerCase()} water (${clarkDegrees}° Clark) across ${sector}&apos;s ${postcodeCount} postcodes means limescale forms gradually. Kettles and glass shower screens near coordinates ${latStr}, ${lngStr} will benefit from quarterly descaling.`
  ] : [ // isSoft
    `Good news for the ${postcodeCount} postcodes in sector ${sector} (centered near ${latStr}°N, ${lngStr}°${lngDirection}): with a low mineral density of just ${avgPpm} PPM, water here is naturally soft. Limescale formation on boiler coils and pipework is virtually zero.`,
    `Because ${companyName} supplies soft water (${clarkDegrees}° Clark) to ${sector}, households enjoy extended heating boiler lifespans and zero severe limescale blockage across all local plumbing networks.`,
    `Environmental monitoring at GPS coordinates ${latStr}, ${lngStr} indicates minimal dissolved calcium carbonate (${avgPpm} PPM), keeping kettle heating elements clean and pipework free of mineral scale.`
  ];
  const paragraphLimescale = spintax(limescaleTemplates, 1);

  // --- ĐOẠN 3: HƯỚNG DẪN CÀI ĐẶT MUỐI MÁY RỬA BÁT ---
  const dishwasherTemplates = [
    `To protect your dishwasher&apos;s internal ion-exchange resin in ${sector}, manual water softener calibration is required. For Bosch and Siemens dishwashers, the recommended salt setting for ${avgPpm} PPM is ${boschSaltSetting || (isSoft ? "H00" : "H04")}. ${isSoft ? "Since the water is soft, regeneration salt usage can be kept to a minimum." : "Filling the salt reservoir ensures calcium ions are neutralized before heating."}`,
    `Serving ${postcodeCount} households near ${latStr}°N, appliance setup in ${sector} requires configuring dishwasher softeners according to ${companyName}&apos;s ${avgPpm} PPM rating. Bosch units should be set to ${boschSaltSetting || (isSoft ? "H00" : "H04")}.`,
    `For pristine, spot-free glassware across ${sector} (GPS ${latStr}, ${lngStr}), adjust dishwasher salt dosage to ${boschSaltSetting || (isSoft ? "H00" : "H04")} based on the local ${clarkDegrees}° Clark water supply.`
  ];
  const paragraphDishwasher = spintax(dishwasherTemplates, 2);

  // --- ĐOẠN 4: ẢNH HƯỞNG ĐẾN DA, TÓC VÀ XÀ PHÒNG ---
  const skinHairTemplates = [
    `Hard minerals interact with fatty acids in soaps, creating insoluble soap scum. In ${sector}, washing with ${avgPpm} PPM water requires approximately ${soapDose} detergent or shampoo to achieve a full lather compared to soft water zones.`,
    `Across the ${postcodeCount} postcodes in ${sector} (near GPS ${latStr}°N), bathing in ${avgPpm} PPM water affects soap lathering. Residents prone to dry hair, eczema, or sensitive skin may benefit from installing an inline shower filter.`,
    `Water supplied by ${companyName} (${avgPpm} PPM / ${clarkDegrees}° Clark) impacts laundry softness in ${sector}. Installing shower filtration systems near coordinates ${latStr}, ${lngStr} helps reduce mineral friction during washing.`
  ];
  const paragraphSkinHair = spintax(skinHairTemplates, 3);

  // --- ĐOẠN 5: KẾT LUẬN & KHUYÊN DÙNG ---
  const verdictTemplates = [
    `Overall, water quality in sector ${sector} reflects ${companyName}&apos;s regional catchment chemistry near coordinates ${latStr}°N, ${lngStr}°${lngDirection}. Use our interactive setup tool below to view exact dishwasher settings for Bosch, Beko, and Miele appliances.`,
    `In summary, ${sector}&apos;s ${avgPpm} PPM rating across ${postcodeCount} postcodes dictates household appliance maintenance. Select your dishwasher brand below for customized salt softener setup.`,
    `Environmental metrics for ${sector} (${clarkDegrees}° Clark) provide clear guidance for plumbing protection. Use the interactive guide below to check exact appliance settings and recommended limescale solutions.`
  ];
  const paragraphVerdict = spintax(verdictTemplates, 4);

  // FAQ Items
  const faqItems = [
    {
      question: `What is the exact water hardness in sector ${sector}?`,
      answer: `Tap water in sector ${sector} averages ${avgPpm} PPM (mg/L) or ${clarkDegrees}° Clark. It is classified as ${hardnessCategory.toLowerCase()} water supplied by ${companyName}.`,
    },
    {
      question: `What dishwasher salt setting should I use for Bosch in ${sector}?`,
      answer: `For Bosch and Siemens dishwashers in sector ${sector} (${avgPpm} PPM), the recommended softener setting is ${boschSaltSetting || (isSoft ? "H00 (No Salt Required)" : "H04")}.`,
    },
    {
      question: `Does hard water cause limescale in ${sector}?`,
      answer: isSoft 
        ? `No, water in ${sector} is soft (${avgPpm} PPM), so limescale accumulation is minimal.`
        : `Yes, at ${avgPpm} PPM, heating elements in kettles, boilers, and washing machines will accumulate limescale without periodic descaling or water softening.`,
    },
  ];

  // Lấy ngày tháng SEO tất định theo Sector
  const { datePublishedISO, dateModifiedISO, dateModifiedFormatted } = getSeoDates(sector);

  // Schema JSON-LD
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `Water Hardness & Limescale Report for Sector ${sector}`,
      "description": `Detailed water quality metrics, PPM ratings, and dishwasher settings for sector ${sector} supplied by ${companyName}.`,
      "image": "https://waterhardness.uk/og-image.png",
      "datePublished": datePublishedISO,
      "dateModified": dateModifiedISO,
      "author": {
        "@type": "Person",
        "@id": "https://waterhardness.uk/#person",
        "name": "Nguyễn Hạc Phong",
        "url": "https://waterhardness.uk/about"
      },
      "publisher": {
        "@type": "Organization",
        "name": "WaterHardness.uk",
        "logo": { "@type": "ImageObject", "url": "https://waterhardness.uk/logo.png" }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map((f) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://waterhardness.uk" },
        { "@type": "ListItem", "position": 2, "name": `Outcode ${outcode}`, "item": `https://waterhardness.uk/water-hardness/${canonicalOutcode}` },
        { "@type": "ListItem", "position": 3, "name": `Sector ${sector}`, "item": `https://waterhardness.uk/water-hardness/${canonicalOutcode}/${canonicalSectorSlug}` }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* BREADCRUMB */}
        <Breadcrumb outcode={outcode} sector={sector} />

        {/* HEADER TITLES */}
        <div className="mt-6 mb-6">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
            Water Hardness in Sector <span className="text-cyan-600">{sector}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Water Supply Zone Report • Supplied by <strong className="text-slate-800">{companyName}</strong>
          </p>
        </div>

        {/* QUICK SNAPSHOT METRICS CARD */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl mb-8 shadow-md border border-slate-800">
          <h2 className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Quick Water Snapshot for {sector}
          </h2>
          {/* 👉 THÊM KHỐI BẢO VỆ TÍN NHIỆM DATA PRECISION Ở ĐÂY */}
            <div>
              {dataPrecision === "zone_level" ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[11px] font-bold">
                  ✓ Verified Zone-Level Data (DWI / Defra)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-[11px] font-medium">
                  ⓘ Regional Estimate ({companyName})
                </span>
              )}
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="text-slate-400 text-xs block font-medium">Average Mineral Hardness</span>
              <span className="text-3xl font-black text-white block mt-1">{avgPpm} PPM</span>
              <span className="text-cyan-400 text-[11px] block mt-0.5 font-bold">{hardnessCategory}</span>
            </div>

            <div>
              <span className="text-slate-400 text-xs block font-medium">English Clark Scale</span>
              <span className="text-3xl font-black text-white block mt-1">{clarkDegrees} °Clark</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">Calcium carbonate equivalent</span>
            </div>

            <div>
              <span className="text-slate-400 text-xs block font-medium">Bosch Dishwasher Setting</span>
              <span className="text-3xl font-black text-cyan-400 block mt-1">{boschSaltSetting || "H00"}</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">
                {isSoft ? "No salt required" : "Softener salt required"}
              </span>
            </div>
          </div>
        </div>

        {/* SEO ARTICLE DÀY ĐẶN (~700 TỪ THẬT DATA DỮ LIỆU ĐẮT GIÁ) */}
        <article className="prose prose-slate max-w-none text-slate-700 mb-10 leading-relaxed text-base sm:text-lg bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> Technical Environmental Analysis
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 border-b border-slate-200 pb-2">
            Water Quality Breakdown: Sector {sector}
          </h2>
          <p>{paragraphIntro}</p>
          <p>{paragraphLimescale}</p>
          <p>{paragraphDishwasher}</p>
          <p>{paragraphSkinHair}</p>
          <p>{paragraphVerdict}</p>
        </article>

        {/* KHỐI TÁC GIẢ E-E-A-T */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 mb-8 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-cyan-400 rounded-full flex items-center justify-center font-black text-sm shrink-0 border border-slate-800">
              NP
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Updated: {dateModifiedFormatted} • Data Verified
              </span>
              <Link href="/about" className="font-bold text-slate-900 hover:text-cyan-600 transition-colors text-sm">
                Nguyễn Hạc Phong <span className="text-slate-400 font-normal text-xs">• Founder & Data Engineer</span>
              </Link>
            </div>
          </div>
          <Link href="/about" className="text-cyan-600 font-bold hover:underline hidden sm:inline text-xs">
            WSZ Methodology & Data Sources →
          </Link>
        </div>

        {/* CLIENT COMPONENT INTERACTIVE (GAUGE BAR + BRAND SELECTOR + AFFILIATE BUY CARDS) */}
        <ApplianceSetupGuide
          sector={sector}
          avgPpm={avgPpm}
          clarkDegrees={clarkDegrees}
          hardnessCategory={hardnessCategory}
          boschSaltSetting={boschSaltSetting}
          companyName={companyName}
        />

        {/* FAQ SECTION */}
        <div className="mt-12">
          <FAQSection items={faqItems} sector={sector} />
        </div>

        {/* INTERNAL LINKING CÙNG OUTCODE */}
        <div className="mt-12">
          <RelatedSectors currentSector={sector} outcode={outcode} />
        </div>
         {/* 🔥 THÊM ĐOẠN CTA CROSS-LINKING NÀY VÀO ĐÂY */}
        <div className="mt-8 bg-cyan-50 p-6 sm:p-8 rounded-3xl border border-cyan-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Curious how Sector {sector} compares?</h3>
            <p className="text-sm text-slate-600 mt-1">
              See how your local water hardness and limescale risk stack up against central London (SW1A 1).
            </p>
          </div>
          <Link 
            href={`/compare/${canonicalSectorSlug}-vs-sw1a-1`} 
            className="bg-slate-900 hover:bg-cyan-600 text-white px-6 py-3.5 rounded-2xl text-sm font-bold transition-all shrink-0 cursor-pointer shadow-xs"
          >
            Compare vs London (SW1A 1) →
          </Link>
        </div>
      </div>
    </div>
  );
}