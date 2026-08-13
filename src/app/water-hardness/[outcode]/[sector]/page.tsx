import { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { getSectorData } from "@/lib/data";

// Components
import Breadcrumb from "@/components/detail/Breadcrumb";
import ApplianceSetupGuide from "@/components/detail/ApplianceSetupGuide";
import FAQSection from "@/components/detail/FAQSection";
import RelatedSectors from "@/components/detail/RelatedSectors";

// Icons
import { 
  CheckCircle2, 
  Droplets, 
  WashingMachine, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  Flame
} from "lucide-react";

// BẬT ISR: Cache trang Sector trên CDN trong 24 tiếng
export const revalidate = 86400; 
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ outcode: string; sector: string }> | { outcode: string; sector: string };
}

// BỌC CACHE REACT ĐỂ TRÁNH TRUYS VẤN KÉP TRONG 1 REQUEST
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

// 1. SINH DYNAMIC METADATA SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await fetchSectorDetails(resolvedParams.sector);

  if (!data) return { title: "Postcode Sector Not Found - WaterHardness.uk" };

  const currentYear = new Date().getFullYear();
  const canonicalOutcode = data.outcode.toLowerCase();
  const canonicalSectorSlug = data.sector.toLowerCase().replace(/\s+/g, "-");

  return {
    title: `Water Hardness in Sector ${data.sector} (${data.avgPpm} PPM) - ${currentYear} Guide`,
    description: `Detailed water quality report for ${data.sector} (${data.companyName}). Average hardness: ${data.avgPpm} PPM (${data.clarkDegrees}° Clark, ${data.hardnessCategory}). View Bosch dishwasher salt settings & limescale solutions.`,
    alternates: {
      canonical: `https://waterhardness.uk/water-hardness/${canonicalOutcode}/${canonicalSectorSlug}`,
    },
    openGraph: {
      title: `Water Hardness in ${data.sector} - ${data.avgPpm} PPM (${data.hardnessCategory})`,
      description: `Check exact water hardness metrics and appliance settings for sector ${data.sector}.`,
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
  // 🔥 ENGINE TÍNH TOÁN & SPINTAX TỰ ĐỘNG BÀI VIẾT (~700 TỪ THẬT DATA)
  // ==============================================================================
  const { sector, outcode, companyName, avgPpm, clarkDegrees, hardnessCategory, boschSaltSetting } = data;

  const isSoft = avgPpm < 100;
  const isModerate = avgPpm >= 100 && avgPpm < 200;
  const isHard = avgPpm >= 200 && avgPpm < 300;
  const isVeryHard = avgPpm >= 300;

  const boilerLoss = isSoft ? "0%" : isModerate ? "5%" : isHard ? "12%" : "20%+";
  const soapDose = isSoft ? "standard" : isHard ? "+30% extra" : "+50% extra";

  // Seed Spintax
  const compositeKey = `${sector}-${companyName}-${avgPpm}-${clarkDegrees}`;
  const seed = generateCompositeSeed(compositeKey);
  const spintax = (options: string[], offset: number = 0) => options[(seed + offset) % options.length];

  // --- ĐOẠN 1: TỔNG QUAN XỨ BẢO HỘ NƯỚC SECTOR ---
  const intros = [
    `According to the latest public disclosures from ${companyName}, tap water across postcode sector ${sector} (outcode ${outcode}) registers an average mineral concentration of ${avgPpm} PPM (mg/L), which translates to ${clarkDegrees}° Clark on the English hardness scale. This water supply is officially classified as ${hardnessCategory}.`,
    `Residents and households operating appliances in ${sector} receive water supplied by ${companyName} with an average hardness rating of ${avgPpm} PPM (${clarkDegrees}° Clark). Categorized as ${hardnessCategory}, understanding these chemical parameters is crucial for preventing plumbing scale and setting dishwasher softeners correctly.`,
    `Managing a household or setting up home appliances in ${sector}? Environmental monitoring indicates that water delivered to this sector by ${companyName} contains ${avgPpm} PPM of dissolved calcium carbonate, placing it in the ${hardnessCategory} threshold.`
  ];
  const paragraphIntro = spintax(intros, 0);

  // --- ĐOẠN 2: PHÂN TÍCH TÁC ĐỘNG LIMESCALE & NĂNG LƯỢNG BOILER ---
  let paragraphLimescale = "";
  if (isVeryHard || isHard) {
    paragraphLimescale = `With a elevated mineral density of ${avgPpm} PPM, sector ${sector} experiences rapid limescale accumulation on heating elements. Unchecked calcium deposits can reduce boiler heat transfer efficiency by up to ${boilerLoss}, leading to increased household heating bills over time. Shower heads, kettles, and tap aerators in ${sector} will require periodic descaling using citric acid or specialized descaling tablets.`;
  } else if (isModerate) {
    paragraphLimescale = `Registering a moderate mineral concentration of ${avgPpm} PPM (${clarkDegrees}° Clark), water in ${sector} presents a manageable limescale risk. While heating element degradation is limited (approx. ${boilerLoss} efficiency loss), gradual white mineral film can still develop inside kettles and glass shower screens if left uncleaned.`;
  } else {
    paragraphLimescale = `Good news for residents in ${sector}: with a low mineral density of just ${avgPpm} PPM (${clarkDegrees}° Clark), water in this area is naturally soft. Limescale formation on pipework, heating coils, and shower heads is minimal, preserving boiler efficiency and extending home appliance lifespans.`;
  }

  // --- ĐOẠN 3: HƯỚNG DẪN CÀI ĐẶT MUỐI MÁY RỬA BÁT (BOSCH, BEKO, MIELE) ---
  const paragraphDishwasher = `To protect your dishwasher&apos;s internal ion-exchange resin in ${sector}, manual water softener calibration is required. For Bosch and Siemens dishwashers, the manufacturer-recommended salt setting for ${avgPpm} PPM is ${boschSaltSetting || (isSoft ? "H00" : "H04")}. ${isSoft ? "Since the water is soft, regeneration salt usage can be kept to a minimum." : "Filling the salt reservoir ensures calcium ions are neutralized before heating, preventing cloudy glass film and white spot residue on washed dishes."}`;

  // --- ĐOẠN 4: ẢNH HƯỞNG ĐẾN DA, TÓC VÀ XÀ PHÒNG ---
  const paragraphSkinHair = `Hard minerals interact with fatty acids in soaps, creating insoluble soap scum. In ${sector}, washing with ${avgPpm} PPM water requires approximately ${soapDose} detergent or shampoo to achieve a full lather compared to soft water zones. Furthermore, residents prone to sensitive skin, eczema, or dry hair may benefit from installing an inline shower filter to reduce mineral friction during washing.`;

  // --- ĐOẠN 5: KẾT LUẬN & KHUYÊN DÙNG ---
  const paragraphVerdict = `Overall, water quality in sector ${sector} reflects ${companyName}&apos;s regional catchment chemistry. Use our interactive setup tool below to view exact brand-by-brand dishwasher settings and recommended limescale protection products for your home.`;

  // FAQ Items
  const faqItems = [
    {
      question: `What is the exact water hardness in sector ${sector}?`,
      answer: `Tap water in sector ${sector} averages ${avgPpm} PPM (mg/L) or ${clarkDegrees}° Clark. It is classified as ${hardnessCategory} water supplied by ${companyName}.`,
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

  // Schema JSON-LD
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `Water Hardness & Limescale Report for Sector ${sector}`,
      "description": `Detailed water quality metrics, PPM ratings, and dishwasher settings for sector ${sector} supplied by ${companyName}.`,
      "image": "https://waterhardness.uk/og-image.png",
      "datePublished": "2026-01-01",
      "dateModified": new Date().toISOString(),
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
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Verification & Data Audit</span>
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

      </div>
    </div>
  );
}