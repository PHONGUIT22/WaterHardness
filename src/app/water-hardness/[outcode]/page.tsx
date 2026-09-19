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
  Scale,
  Flame,
  WashingMachine,
  Activity
} from "lucide-react";

// BẬT ISR: Cache trang Outcode trên CDN trong 24 tiếng
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

// 1. TỰ ĐỘNG SINH METADATA SEO ĐỘC BẢN CHO TỪNG OUTCODE
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getOutcodeOverviewData(resolvedParams.outcode);

  if (!data) {
    return {
      title: "Outcode Area Not Found - WaterHardness.uk",
    };
  }

  const hardnessCategory = data.avgPpm < 100 ? "Soft Water" : data.avgPpm < 200 ? "Moderately Hard" : data.avgPpm < 300 ? "Hard Water" : "Very Hard Water";
  const clarkDegrees = (data.avgPpm * 0.07).toFixed(1);

  return {
    title: `${data.outcode} Water Hardness: ${data.avgPpm} PPM & Guide`,
    description: `Water hardness in outcode ${data.outcode} (${data.companyName}) averages ${data.avgPpm} PPM across ${data.totalSectors} sectors. Check limescale risks & appliance settings.`,
    alternates: {
      canonical: `https://waterhardness.uk/water-hardness/${data.outcode.toLowerCase()}`,
    },
    openGraph: {
      title: `${data.outcode} Water Hardness: ${data.avgPpm} PPM (${data.companyName})`,
      description: `Official water hardness report for outcode ${data.outcode}: average ${data.avgPpm} PPM. Compare softest vs hardest sectors and check local appliance calibrations.`,
      url: `https://waterhardness.uk/water-hardness/${data.outcode.toLowerCase()}`,
      siteName: "WaterHardness.uk",
      locale: "en_GB",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.outcode} Water Hardness: ${data.avgPpm} PPM (${data.companyName})`,
      description: `Water hardness in outcode ${data.outcode} averages ${data.avgPpm} PPM across ${data.totalSectors} sectors.`,
    },
  };
}

// 2. MAIN SERVER COMPONENT
export default async function OutcodeHubPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getOutcodeOverviewData(resolvedParams.outcode);

  if (!data) {
    notFound();
  }

  // ==============================================================================
  // 🔥 MA TRẬN PHÂN TÍCH THỦY VĂN ĐA TẦNG CHO 3.000 OUTCODES
  // ==============================================================================
  const { outcode, companyName, avgPpm, totalSectors, softestSector, hardestSector, sectorsList } = data;

  const softestPpm = softestSector?.avgPpm || avgPpm;
  const hardestPpm = hardestSector?.avgPpm || avgPpm;
  const softestSectorName = softestSector?.sector || outcode;
  const hardestSectorName = hardestSector?.sector || outcode;
  const varianceDelta = hardestPpm - softestPpm;

  // Tính tổng số lượng Postcode thực tế trong toàn bộ Outcode
  const totalPostcodes = sectorsList.reduce(
    (sum, item) => sum + (item.postcodeCount || 0),
    0
  );

  // Phân tầng độ cứng và các hệ đo lường
  const isVerySoft = avgPpm < 60;
  const isSoft = avgPpm >= 60 && avgPpm < 100;
  const isModerate = avgPpm >= 100 && avgPpm < 200;
  const isHard = avgPpm >= 200 && avgPpm < 300;
  const isVeryHard = avgPpm >= 300;

  const clarkDegrees = (avgPpm * 0.07).toFixed(1);
  const frenchDegrees = (avgPpm * 0.1).toFixed(1);
  const germanDegrees = (avgPpm * 0.056).toFixed(1);

  // So sánh với mức chuẩn trung bình toàn Vương Quốc Anh (~200 PPM)
  const UK_NATIONAL_BENCHMARK = 200;
  const diffVsUK = Math.round(((avgPpm - UK_NATIONAL_BENCHMARK) / UK_NATIONAL_BENCHMARK) * 100);
  const isHarderThanUK = diffVsUK > 0;
  const isSofterThanUK = diffVsUK < 0;

  // Tác động nhiệt và định lượng thiết bị
  const boilerEfficiencyLoss = isVerySoft ? "0%" : isSoft ? "< 2%" : isModerate ? "4% – 7%" : isHard ? "10% – 15%" : "18% – 25%+";
  const kettleDescalingFreq = isVeryHard ? "Every 2–3 weeks" : isHard ? "Monthly" : isModerate ? "Quarterly" : "Virtually never";
  const defaultBoschSetting = isVerySoft || isSoft ? "H00 (No salt required)" : isModerate ? "H02 – H03" : isHard ? "H04 – H05" : "H06 – H07 (Max salt)";

  // Phân tích nguồn nước theo đơn vị cấp nước (Water Supplier Hydro-Intelligence)
  const isChalkAquiferSupplier = companyName.includes("Thames") || companyName.includes("Anglian") || companyName.includes("Affinity") || companyName.includes("Southern") || companyName.includes("South East");
  const isUplandReservoirSupplier = companyName.includes("Scottish") || companyName.includes("Welsh") || companyName.includes("United Utilities");
  const isMixedCatchmentSupplier = companyName.includes("Severn Trent") || companyName.includes("Yorkshire") || companyName.includes("Northumbrian") || companyName.includes("South West") || companyName.includes("Wessex");

  // Kiểm tra case Data Phẳng (Số PPM các sector bằng nhau)
  const isFlatData = softestPpm === hardestPpm;

  const hardnessCategoryText = isVerySoft || isSoft
    ? "Soft Water"
    : isModerate
    ? "Moderately Hard Water"
    : isHard
    ? "Hard Water"
    : "Very Hard Water";

  const cleanOutcodeSlug = outcode.toLowerCase().trim();

  // Spintax Seed tất định cho từng Outcode
  const seed = outcode.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) * 17 + avgPpm;
  const spintax = (options: string[], offset: number = 0) => options[(seed + offset) % options.length];

  // --- ĐOẠN 1: MỞ BÀI TỔNG QUAN XỨ CẤP NƯỚC (NHÚNG ĐỘ LỆCH SO VỚI TOÀN ANH QUỐC) ---
  const intros = [
    `Public water quality testing records compiled across all ${totalSectors} postcode sectors (serving ${totalPostcodes.toLocaleString()} active postcodes) in outcode ${outcode} confirm an average water hardness of ${avgPpm} PPM (${clarkDegrees}° Clark). Maintained and distributed under the authority of ${companyName}, tap water in ${outcode} is classified as ${hardnessCategoryText.toLowerCase()}, rating ${Math.abs(diffVsUK)}% ${isHarderThanUK ? "harder than" : isSofterThanUK ? "softer than" : "comparable to"} the UK national average (200 PPM).`,
    `Managing appliances or installing plumbing systems in outcode ${outcode}? Environmental monitoring reports from ${companyName} indicate a baseline mineral concentration of ${avgPpm} PPM (${clarkDegrees} English degrees). Across its ${totalSectors} constituent sectors and ${totalPostcodes.toLocaleString()} postcodes, the area presents a ${hardnessCategoryText.toLowerCase()} profile.`,
    `Covering ${totalPostcodes.toLocaleString()} delivery points across outcode ${outcode}, domestic tap water supplied by ${companyName} registers an average mineral density of ${avgPpm} PPM (${frenchDegrees}°fH / ${germanDegrees}°dH). This places the entire ${outcode} postal district within the ${hardnessCategoryText.toLowerCase()} band.`
  ];
  const paragraphIntro = spintax(intros, 0);

  // --- ĐOẠN 2: PHÂN TÍCH ĐỘ PHÂN TÁN VÙNG (VARIANCE DELTA) ---
  let paragraphDisparity = "";
  if (isFlatData) {
    paragraphDisparity = `Mineral concentration is remarkably uniform throughout outcode ${outcode}. All ${totalSectors} sectors, from ${softestSectorName} to ${hardestSectorName}, register an identical reading of ${avgPpm} PPM. This consistency confirms that ${companyName} distributes water from a unified primary treatment works and supply reservoir across this entire zone.`;
  } else {
    paragraphDisparity = `Water hardness fluctuates across individual supply zones in outcode ${outcode}, exhibiting a ${varianceDelta} PPM variance between neighborhoods. Tap water is softest in sector ${softestSectorName} (${softestPpm} PPM), while the highest mineral load occurs in sector ${hardestSectorName} (${hardestPpm} PPM), reflecting localized blending from distinct borehole and river extraction facilities.`;
  }

  // --- ĐOẠN 3: NGUỒN NƯỚC ĐỊA CHẤT ĐẶC THÙ CỦA CÔNG TY CẤP NƯỚC ---
  let paragraphGeology = "";
  if (isChalkAquiferSupplier) {
    paragraphGeology = `Water distributed by ${companyName} in outcode ${outcode} originates largely from underground chalk and limestone aquifers. Natural percolation through deep subterranean calcium deposits enriches the water with dissolved calcium carbonate, contributing directly to the ${avgPpm} PPM rating and resulting in rapid limescale accumulation on heating elements.`;
  } else if (isUplandReservoirSupplier) {
    paragraphGeology = `The municipal water supply managed by ${companyName} across ${outcode} is predominantly abstracted from upland surface reservoirs and natural catchments characterized by impermeable granite geology. This natural process limits mineral dissolution, preserving an exceptionally clean, naturally soft supply (${avgPpm} PPM).`;
  } else if (isMixedCatchmentSupplier) {
    paragraphGeology = `Supplies in ${outcode} are sourced through a balanced combination of lowland river abstraction and regional storage reservoirs managed by ${companyName}. Water hardness fluctuates seasonally between wet and dry periods, maintaining a stable annual average of ${avgPpm} PPM across all ${totalPostcodes.toLocaleString()} local postcodes.`;
  } else {
    paragraphGeology = `Treated in strict compliance with the Drinking Water Inspectorate (DWI) standards, tap water in ${outcode} maintains an average mineral density of ${avgPpm} PPM, ensuring balanced purity and consistent municipal distribution by ${companyName}.`;
  }

  // --- ĐOẠN 4: LỜI KHUYÊN LÒ HƠI & THIẾT BỊ GIA ĐÌNH ---
  const applianceTemplates = isVerySoft || isSoft ? [
    `With naturally soft water (${avgPpm} PPM) in outcode ${outcode}, heating cylinders and combi boilers operate near peak thermodynamic efficiency with negligible limescale drag (${boilerEfficiencyLoss}). Dishwashers require minimal or no softener regeneration salt (recommended setting: ${defaultBoschSetting}), and standard detergent dosages are fully effective.`,
    `Households across ${outcode}&apos;s ${totalSectors} sectors benefit from extended appliance lifespans. Because water contains just ${avgPpm} PPM of dissolved minerals, kettles remain clean without periodic acid descaling, and plumbing networks are protected from scale constriction.`
  ] : [
    `Because water delivered to ${outcode} averages ${avgPpm} PPM, limescale represents an active maintenance factor. Heating elements in combi boilers and hot water cylinders face estimated efficiency losses of ${boilerEfficiencyLoss} without scale treatment. Kettle heating elements require descaling roughly ${kettleDescalingFreq.toLowerCase()}, and dishwasher water softeners should be calibrated to ${defaultBoschSetting}.`,
    `Operating domestic appliances in ${outcode}&apos;s ${hardnessCategoryText.toLowerCase()} (${avgPpm} PPM) requires proactive protection. Using inline electrolytic scale inhibitors or water softeners prevents heat exchanger calcification and eliminates cloudy mineral residue on glassware across all ${totalPostcodes.toLocaleString()} postcodes.`
  ];
  const paragraphAppliance = spintax(applianceTemplates, 1);

  // Ngày cập nhật SEO đồng bộ
  const { datePublishedISO, dateModifiedISO, dateModifiedFormatted } = getSeoDates(outcode);

  // FAQ Schema & UI items
  const faqItems = [
    {
      question: `What is the average water hardness in outcode ${outcode}?`,
      answer: `Tap water across outcode ${outcode} averages ${avgPpm} PPM (mg/L), which equals ${clarkDegrees}° Clark, ${frenchDegrees}°fH, or ${germanDegrees}°dH. It is officially classified as ${hardnessCategoryText.toLowerCase()} water supplied by ${companyName}.`,
    },
    {
      question: `Is water in ${outcode} harder than the UK national average?`,
      answer: `The UK baseline average is approximately 200 PPM. At ${avgPpm} PPM, water in outcode ${outcode} is ${Math.abs(diffVsUK)}% ${isHarderThanUK ? "harder than" : isSofterThanUK ? "softer than" : "equal to"} the national benchmark.`,
    },
    {
      question: `What dishwasher salt setting is recommended for ${outcode}?`,
      answer: `For Bosch, Siemens, and Neff dishwashers in outcode ${outcode} (${avgPpm} PPM), the recommended softener setting is ${defaultBoschSetting}.`,
    },
    {
      question: `Who manages the municipal water supply in outcode ${outcode}?`,
      answer: `Public tap water infrastructure across all ${totalSectors} sectors in outcode ${outcode} is distributed and monitored by ${companyName}.`,
    }
  ];

  // Schema EEAT chuẩn cho trang Hub
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": `Outcode ${outcode} Water Hardness & Limescale Quality Report`,
        "description": `Comprehensive water hardness metrics, mineral PPM ratings, and appliance settings across ${totalSectors} sectors in ${outcode} (${companyName}).`,
        "image": "https://waterhardness.uk/og-image.png",
        "datePublished": datePublishedISO,
        "dateModified": dateModifiedISO,
        "author": {
          "@type": "Person",
          "@id": "https://waterhardness.uk/#person",
          "name": "Nguyễn Hạc Phong",
          "jobTitle": "Lead Water Quality Data Engineer",
          "url": "https://waterhardness.uk/about"
        },
        "publisher": {
          "@type": "Organization",
          "name": "WaterHardness.uk",
          "logo": { "@type": "ImageObject", "url": "https://waterhardness.uk/logo.png" }
        }
      },
      {
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
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://waterhardness.uk" },
          { "@type": "ListItem", "position": 2, "name": "All Outcodes", "item": "https://waterhardness.uk/outcodes" },
          { "@type": "ListItem", "position": 3, "name": `Outcode ${outcode}`, "item": `https://waterhardness.uk/water-hardness/${cleanOutcodeSlug}` }
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
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Regional Water Intelligence • 2026 Updated
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
            <div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase">
                Water Hardness in <span className="text-cyan-400">{outcode}</span>
              </h1>
              <p className="text-slate-400 mt-3 text-base sm:text-lg max-w-2xl">
                Water quality metrics across {totalSectors} postcode sectors ({totalPostcodes.toLocaleString()} postcodes) in {outcode} ({companyName}).
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shrink-0 text-center sm:text-right">
              <span className="text-slate-400 text-xs font-medium block uppercase tracking-wider">
                Outcode Mean Hardness
              </span>
              <span className="text-4xl sm:text-5xl font-black text-cyan-400 block mt-1">
                {avgPpm}
                <span className="text-xs font-normal text-slate-400"> PPM</span>
              </span>
              <span className="text-xs font-bold text-slate-300 block mt-1">
                {clarkDegrees} °Clark • {hardnessCategoryText}
              </span>
            </div>
          </div>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        
        {/* KPI METRIC CARDS ĐỘC BẢN TOÀN OUTCODE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">vs. UK Benchmark</span>
              <span className={`text-2xl font-black block mt-0.5 ${isHarderThanUK ? "text-rose-600" : isSofterThanUK ? "text-emerald-600" : "text-slate-900"}`}>
                {isHarderThanUK ? `+${diffVsUK}% Harder` : isSofterThanUK ? `${diffVsUK}% Softer` : "Equal"}
              </span>
              <span className="text-slate-500 text-[11px] block">vs 200 PPM national average</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Boiler Heat Loss</span>
              <span className="text-2xl font-black text-slate-900 block mt-0.5">{boilerEfficiencyLoss}</span>
              <span className="text-slate-500 text-[11px] block">Est. thermal heating drag</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
              <WashingMachine className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Kettle Descaling</span>
              <span className="text-2xl font-black text-slate-900 block mt-0.5">{kettleDescalingFreq}</span>
              <span className="text-slate-500 text-[11px] block">Appliance maintenance cycle</span>
            </div>
          </div>

        </div>

        {/* SEO ARTICLE CHUYÊN SÂU ĐỘC BẢN */}
        <article className="prose prose-slate max-w-none text-slate-700 mb-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm leading-relaxed text-base sm:text-lg space-y-4">
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> Regional Hydro-Geological Overview
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-3">
            Water Hardness Breakdown: Outcode {outcode}
          </h2>
          <p>{paragraphIntro}</p>
          <p>{paragraphDisparity}</p>
          <p>{paragraphGeology}</p>
          <p>{paragraphAppliance}</p>
        </article>

        {/* DÒNG XÁC NHẬN TÁC GIẢ EEAT */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 mb-12 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-cyan-400 rounded-full flex items-center justify-center font-black text-sm shrink-0 border border-slate-800">
              NP
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Updated: {dateModifiedFormatted} • DWI & Defra Compliant Data
              </span>
              <Link href="/about" className="font-bold text-slate-900 hover:text-cyan-600 transition-colors text-sm">
                Nguyễn Hạc Phong <span className="text-slate-400 font-normal text-xs">• Lead Water Quality Data Engineer</span>
              </Link>
            </div>
          </div>
          <Link href="/about" className="text-cyan-600 font-bold hover:underline hidden sm:inline text-xs">
            Methodology & Catchment Sources →
          </Link>
        </div>

        {/* INTERNAL LINKING CROSS-LINKING ĐẨY TRAFFIC CHO TRANG COMPARE */}
        {hardestSector && (
          <div className="mb-12 bg-cyan-50 p-6 sm:p-8 rounded-3xl border border-cyan-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-cyan-700 font-bold text-xs uppercase tracking-wider mb-1">
                <Scale className="w-4 h-4" /> Regional Comparison
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Curious how outcode {outcode} compares?</h3>
              <p className="text-sm text-slate-600 mt-0.5">
                See how the hardest sector in {outcode} ({hardestSector.sector}) compares against central London water metrics.
              </p>
            </div>
            <Link 
              href={`/compare/${hardestSector.sector.toLowerCase().replace(/\s+/g, "-")}-vs-sw1a-1`} 
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
                  <h2 className="font-bold text-slate-900 text-lg">Softest Sector in {outcode}</h2>
                  <p className="text-xs text-slate-500">Lowest mineral concentration</p>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                Softest
              </span>
            </div>

            {softestSector && (
              <Link
                href={`/water-hardness/${cleanOutcodeSlug}/${softestSector.sector.toLowerCase().trim().replace(/\s+/g, "-")}`}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50/60 rounded-2xl transition-colors border border-slate-200/60 group"
              >
                <div>
                  <span className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors block">
                    Sector {softestSector.sector}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {softestSector.postcodeCount} Postcodes • {softestSector.hardnessCategory}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 text-lg block">{softestSector.avgPpm} PPM</span>
                  <span className="text-xs font-semibold text-emerald-600 block">{softestSector.clarkDegrees} °Clark</span>
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
                  <h2 className="font-bold text-slate-900 text-lg">Hardest Sector in {outcode}</h2>
                  <p className="text-xs text-slate-500">Highest mineral concentration</p>
                </div>
              </div>
              <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                Highest Hardness
              </span>
            </div>

            {hardestSector && (
              <Link
                href={`/water-hardness/${cleanOutcodeSlug}/${hardestSector.sector.toLowerCase().trim().replace(/\s+/g, "-")}`}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl transition-colors border border-slate-200/60 group"
              >
                <div>
                  <span className="font-bold text-slate-900 text-base group-hover:text-amber-700 transition-colors block">
                    Sector {hardestSector.sector}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {hardestSector.postcodeCount} Postcodes • {hardestSector.hardnessCategory}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 text-lg block">{hardestSector.avgPpm} PPM</span>
                  <span className="text-xs font-semibold text-amber-600 block">{hardestSector.clarkDegrees} °Clark</span>
                </div>
              </Link>
            )}
          </div>

        </section>

        {/* FAQ SECTION HIỂN THỊ TRÊN UI */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm mb-16">
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            Frequently Asked Questions: Water in Outcode {outcode}
          </h2>
          <div className="space-y-6">
            {faqItems.map((f, i) => (
              <div key={i} className="border-b border-slate-100 pb-4 last:border-none last:pb-0">
                <h3 className="font-bold text-slate-900 text-base mb-2">Q: {f.question}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DANH SÁCH TẤT CẢ SECTOR TRONG OUTCODE */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
              <Building2 className="w-6 h-6 text-cyan-600" /> All Postcode Sectors in {outcode}
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Select a postcode sector below to view exact water softener salt settings, limescale protection guides, and appliance recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sectorsList.map((item) => {
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