import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOutcodeOverviewData, getAllOutcodesFromDB } from "@/lib/data";
import { getSeoDates } from "@/lib/seoDates";
import QuoteRequestCard from "@/components/lead/QuoteRequestCard";
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
  Activity,
  CheckCircle2,
  Check
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
    description: `Check water hardness in ${data.outcode} (${data.avgPpm} PPM, ${data.companyName}). Find kettle descaling advice, limescale risks & appliance salt settings.`,
    alternates: {
      canonical: `https://waterhardness.uk/water-hardness/${data.outcode.toLowerCase()}`,
    },
    openGraph: {
      title: `${data.outcode} Water Hardness: ${data.avgPpm} PPM (${data.companyName})`,
      description: `Water hardness in ${data.outcode} averages ${data.avgPpm} PPM across ${data.totalSectors} sectors. Check limescale risks & appliance settings.`,
      url: `https://waterhardness.uk/water-hardness/${data.outcode.toLowerCase()}`,
      siteName: "WaterHardness.uk",
      locale: "en_GB",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.outcode} Water Hardness: ${data.avgPpm} PPM (${data.companyName})`,
      description: `Water hardness in ${data.outcode} averages ${data.avgPpm} PPM across ${data.totalSectors} sectors.`,
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

  // Kiểm tra case Data Phẳng hoặc Chỉ có 1 Sector (Đòn bẩy 4)
  const isSingleSector = totalSectors === 1;
  const isFlatData = softestPpm === hardestPpm;
  const isUniformCatchment = isFlatData || isSingleSector;

  // Đòn bẩy 1: Thống kê tỷ lệ phân bổ các Sector theo độ cứng
  const hardOrVeryHardCount = sectorsList.filter((s) => s.avgPpm >= 200).length;
  const hardOrVeryHardPercent = Math.round((hardOrVeryHardCount / totalSectors) * 100);

  // Đòn bẩy 2: Ước tính chi phí gia đình phát sinh hàng năm dựa trên mức độ cứng thực tế
  const annualGasPenalty = isVeryHard
    ? "£190 – £260"
    : isHard
    ? "£130 – £190"
    : isModerate
    ? "£40 – £80"
    : "£0 (Optimal heat transfer)";

  const annualSaltConsumption = isVeryHard
    ? "14 – 18 kg"
    : isHard
    ? "10 – 14 kg"
    : isModerate
    ? "4 – 8 kg"
    : "0 – 2 kg (Salt optional)";

  const applianceLifespanImpact = isVeryHard
    ? "-40% to -50% life reduction without water softening"
    : isHard
    ? "-25% to -35% life reduction on heating elements"
    : isModerate
    ? "Minor scale accumulation over 3–5 operating years"
    : "Optimal appliance longevity (100% expected lifespan)";

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

  // --- ĐOẠN 1: MỞ BÀI TỔNG QUAN HỘ GIA ĐÌNH ANH QUỐC (GIỌNG ANH BẢN ĐỊA, THỰC TẾ) ---
  const intros = [
    `Tired of stubborn limescale buildup in your kettle or dealing with an unappetising film of scum on your morning cuppa? Tap water across all ${totalSectors} postcode sectors in outcode ${outcode} (covering ${totalPostcodes.toLocaleString()} homes) averages ${avgPpm} PPM (${clarkDegrees}° Clark). Maintained and distributed by ${companyName}, this places the district firmly into the ${hardnessCategoryText.toLowerCase()} bracket—approximately ${Math.abs(diffVsUK)}% ${isHarderThanUK ? "harder than" : isSofterThanUK ? "softer than" : "comparable to"} the UK national baseline (200 PPM).`,
    `If you have recently moved to ${outcode} or are setting up new kitchen appliances, getting your local water hardness right makes all the difference. Official water testing records from ${companyName} show a baseline mineral level of ${avgPpm} PPM (${clarkDegrees}° Clark) across ${outcode}&apos;s ${totalPostcodes.toLocaleString()} postcodes. That classifies this postal area as ${hardnessCategoryText.toLowerCase()}, directly impacting how often you need to top up dishwasher salt and how fast heating elements fur up with scale.`,
    `Serving ${totalPostcodes.toLocaleString()} homes and businesses across outcode ${outcode}, mains tap water supplied by ${companyName} registers an average mineral density of ${avgPpm} PPM (${frenchDegrees}°fH / ${germanDegrees}°dH). Rated as ${hardnessCategoryText.toLowerCase()}, local water hardness determines how well laundry detergents lather, the rate of scale accumulation in combi boilers, and whether sensitive skin or eczema flares up after showers.`
  ];
  const paragraphIntro = spintax(intros, 0);

  // --- ĐOẠN 2: PHÂN TÍCH ĐỘ PHÂN TÁN VÙNG GIỮA CÁC SECTOR ---
  let paragraphDisparity = "";
  if (isFlatData) {
    paragraphDisparity = `Water hardness is remarkably consistent across all ${totalSectors} sectors of ${outcode}, with readings holding steady at ${avgPpm} PPM from ${softestSectorName} through to ${hardestSectorName}. This uniform profile means every household on the ${companyName} network in this zone shares the same appliance settings and kettle descaling routine.`;
  } else {
    paragraphDisparity = `Water hardness isn't identical across every street in ${outcode}—there is a ${varianceDelta} PPM variance between neighborhoods. Residents in sector ${softestSectorName} enjoy the softest water at ${softestPpm} PPM, whereas taps in sector ${hardestSectorName} register the highest mineral load at ${hardestPpm} PPM. This localized disparity occurs because ${companyName} blends supplies from different boreholes, rivers, and storage reservoirs depending on elevation and seasonal demand.`;
  }

  // --- ĐOẠN 3: NGUỒN NƯỚC ĐỊA CHẤT ĐẶC THÙ (DWI REGULATED) ---
  let paragraphGeology = "";
  if (isChalkAquiferSupplier) {
    paragraphGeology = `The reason tap water in ${outcode} carries significant dissolved minerals lies in local geology. ${companyName} abstracts substantial water supplies from subterranean chalk and limestone aquifers. As rainwater percolates through deep calcium-rich rock strata over decades, it dissolves natural calcium carbonate. While entirely safe and wholesome under Drinking Water Inspectorate (DWI) standards, these minerals precipitate out when heated above 60°C, leaving stubborn limescale deposits on heating coils.`;
  } else if (isUplandReservoirSupplier) {
    paragraphGeology = `Tap water supplied to ${outcode} by ${companyName} originates predominantly from upland surface reservoirs and catchments surrounded by hard, impermeable granite or sandstone geology. Because rainwater runs off dense bedrock without dissolving heavy calcium deposits, it arrives at local taps naturally soft at ${avgPpm} PPM, keeping plumbing networks clear without requiring water softeners.`;
  } else if (isMixedCatchmentSupplier) {
    paragraphGeology = `Supplies across ${outcode} are managed by ${companyName} through a balanced mix of lowland river abstraction and regional storage reservoirs. Water hardness fluctuates moderately between wet winter periods and dry summer months, averaging ${avgPpm} PPM across all ${totalPostcodes.toLocaleString()} local postcodes under strict Drinking Water Inspectorate (DWI) compliance.`;
  } else {
    paragraphGeology = `Treated in strict compliance with Drinking Water Inspectorate (DWI) standards, tap water in ${outcode} maintains an average mineral density of ${avgPpm} PPM, ensuring consistent municipal distribution and wholesome tap drinking water from ${companyName}.`;
  }

  // --- ĐOẠN 4: LỜI KHUYÊN THỰC TẾ CHO GIA ĐÌNH ANH (KETTLES, BOILERS, SALT & SKIN) ---
  const applianceTemplates = isVerySoft || isSoft ? [
    `Living with naturally soft water (${avgPpm} PPM) in outcode ${outcode} offers welcome household benefits. Your kettle stays clean with virtually zero limescale buildup, tea brews clear without unsightly floating scum, and shower gels lather effortlessly. Combi boilers and immersion heaters maintain peak fuel efficiency (${boilerEfficiencyLoss} scale drag), and dishwasher salt top-up is optional or minimal (recommended setting: ${defaultBoschSetting}).`,
    `Households across ${outcode}&apos;s ${totalSectors} sectors enjoy extended appliance lifespans. Because water contains just ${avgPpm} PPM of dissolved minerals, kettles remain clean without periodic acid descaling, and sensitive skin or eczema is far less prone to irritation caused by calcium mineral deposits.`
  ] : isModerate ? [
    `With moderate water hardness (${avgPpm} PPM) in ${outcode}, kettles and showerheads build a light white chalk ring every 2–3 months. A quick rinse with warm water and white vinegar or food-grade citric acid crystals clears the element in minutes. To prevent cloudy glassware, maintain your dishwasher salt top-up set to ${defaultBoschSetting}. Combi boilers also benefit from regular inhibitor checks during annual boiler servicing in line with British Standard BS 7593.`,
    `Households across ${outcode}&apos;s ${totalPostcodes.toLocaleString()} postcodes experience manageable mineral levels. While heating efficiency losses remain mild (${boilerEfficiencyLoss}), routine descaling of steam irons and thermostatic shower cartridges prevents gradual mineral clogging.`
  ] : [
    `With tap water averaging ${avgPpm} PPM in outcode ${outcode}, proactive limescale prevention is essential. Expect rapid limescale buildup in kettles—monthly descaling with white vinegar or food-grade citric acid crystals keeps the heating base efficient and stops chalky flakes falling into your tea. Combi boiler heat exchangers are also susceptible to scale encrustation, which can increase annual gas heating bills by ${boilerEfficiencyLoss} without inline scale protection under British Standard BS 7593.`,
    `Hard water in ${outcode} (${avgPpm} PPM) often causes a cloudy scum on hot drinks and makes soap harder to lather, aggravating dry skin and eczema sensitivity after hot baths. For appliances, ensure regular water softener salt top-ups and calibrate your dishwasher to ${defaultBoschSetting} to avoid cloudy glassware, white streaks, and heating element burnout across all ${totalPostcodes.toLocaleString()} postcodes.`
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
        "description": `Detailed water hardness report for outcode ${outcode}: ${avgPpm} PPM (${clarkDegrees}° Clark) supplied by ${companyName}. Includes appliance salt calibrations, kettle descaling advice, and boiler protection under British Standard BS 7593.`,
        "image": "https://waterhardness.uk/og-image.png",
        "datePublished": datePublishedISO,
        "dateModified": dateModifiedISO,
        "author": {
          "@type": "Organization",
          "name": "WaterHardness.uk Technical & Water Quality Research Team",
          "url": "https://waterhardness.uk/about"
        },
        "publisher": {
          "@type": "Organization",
          "name": "WaterHardness.uk",
          "logo": { "@type": "ImageObject", "url": "https://waterhardness.uk/logo.png" }
        },
        "citation": [
          "https://www.dwi.gov.uk/",
          "https://www.ciphe.org.uk/"
        ],
        "about": [
          {
            "@type": "Place",
            "name": `Outcode ${outcode}`,
            "description": `Postal outcode district ${outcode} in the UK served by ${companyName}`
          },
          {
            "@type": "PropertyValue",
            "name": "Average Water Hardness",
            "value": avgPpm,
            "unitText": "mg/L CaCO3",
            "description": `${hardnessCategoryText} water supplied by ${companyName}`
          }
        ]
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

      {/* HERO SECTION CỦA OUTCODE - ABOVE-THE-FOLD INSTANT VERDICT */}
      <section className="bg-slate-900 text-white pt-16 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center sm:text-left">
          
          <div className="inline-flex items-center gap-2 bg-slate-800 text-cyan-400 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Official Supplier Data: {companyName} • DWI & BS 7593 Standards</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
            <div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase">
                Water Hardness in <span className="text-cyan-400">{outcode}</span>
              </h1>
              <p className="text-slate-300 mt-3 text-base sm:text-lg max-w-2xl font-medium">
                Official water quality verdict for outcode <span className="text-white font-bold">{outcode}</span>: classified as <span className="text-cyan-400 font-bold">{hardnessCategoryText}</span> ({avgPpm} PPM), supplied and treated by <span className="text-white font-bold">{companyName}</span> across {totalSectors} sectors.
              </p>

              {/* INSTANT VERDICT PILLS */}
              <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                <span className={`px-3 py-1 rounded-full font-bold border ${isVeryHard || isHard ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : isModerate ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"}`}>
                  Rating: {hardnessCategoryText}
                </span>
                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-semibold border border-slate-700">
                  {avgPpm} PPM • {clarkDegrees}° Clark
                </span>
                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-semibold border border-slate-700">
                  Supplier: {companyName}
                </span>
                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-semibold border border-slate-700">
                  {isHarderThanUK ? `+${diffVsUK}% above UK average` : isSofterThanUK ? `${diffVsUK}% below UK average` : "At UK national average (200 PPM)"}
                </span>
              </div>
            </div>

            <div className="bg-slate-800/90 p-6 rounded-3xl border border-slate-700/80 shrink-0 text-center sm:text-right shadow-xl">
              <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">
                Outcode Mean Hardness
              </span>
              <span className="text-4xl sm:text-5xl font-black text-cyan-400 block mt-1">
                {avgPpm}
                <span className="text-xs font-normal text-slate-400"> PPM</span>
              </span>
              <span className="text-sm font-bold text-slate-200 block mt-1">
                {clarkDegrees}° Clark • {hardnessCategoryText}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                {frenchDegrees}°fH • {germanDegrees}°dH
              </span>
            </div>
          </div>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        
        {/* LEVER 3: DIRECT ANSWER DIAGNOSTIC BLOCK (AI OVERVIEWS & UK HOUSEHOLD ADVISOR) */}
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50/60 border-2 border-cyan-200 rounded-3xl p-6 sm:p-7 mb-8 text-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-800 font-bold text-xs uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-4 h-4 text-cyan-600" />
            <span>Outcode {outcode} Household Water Quality Verdict & Practical Advice</span>
          </div>

          <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-900 mb-4">
            Domestic tap water in outcode <strong>{outcode}</strong> is officially classified as <strong>{hardnessCategoryText.toLowerCase()}</strong>, averaging <strong>{avgPpm} PPM</strong> (mg/L CaCO₃) or <strong>{clarkDegrees}° Clark</strong>, supplied and treated by <strong>{companyName}</strong> across all {totalSectors} postcode sectors ({totalPostcodes.toLocaleString()} postcodes). Readings range from <strong>{softestPpm} PPM</strong> ({softestSectorName}) to <strong>{hardestPpm} PPM</strong> ({hardestSectorName}){varianceDelta > 0 ? `, showing a local disparity of ${varianceDelta} PPM` : " with consistent mineral levels throughout"}.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-cyan-200/70 text-xs sm:text-sm text-slate-700">
            <div className="bg-white/80 p-3.5 rounded-2xl border border-cyan-100">
              <span className="font-bold text-slate-900 block mb-1">☕ Kettle & Tea Quality:</span>
              <p className="leading-normal text-slate-600">
                {isVeryHard || isHard
                  ? "Rapid limescale buildup in kettles with floating scum on your cuppa. Descale monthly using white vinegar or food-grade citric acid."
                  : isModerate
                  ? "Gradual chalky ring forms in kettles over 2–3 months. Descale quarterly with citric acid crystals to keep heating elements clean."
                  : "Naturally soft water leaves kettles clear of mineral furring. Your tea brews bright and clean with zero tea scum."}
              </p>
            </div>

            <div className="bg-white/80 p-3.5 rounded-2xl border border-cyan-100">
              <span className="font-bold text-slate-900 block mb-1">🚿 Skin & Bathing:</span>
              <p className="leading-normal text-slate-600">
                {isVeryHard || isHard
                  ? "High calcium levels can aggravate dry skin & eczema sensitivity. Soap lathers less easily, often leaving a tight feeling after hot showers."
                  : isModerate
                  ? "Moderate mineral content is generally gentle on skin, producing normal lather with everyday soaps and shampoos."
                  : "Gentle on sensitive skin and eczema-prone households. Soaps lather richly with small amounts of product."}
              </p>
            </div>

            <div className="bg-white/80 p-3.5 rounded-2xl border border-cyan-100">
              <span className="font-bold text-slate-900 block mb-1">🍽️ Appliances & Salt:</span>
              <p className="leading-normal text-slate-600">
                {isVeryHard || isHard
                  ? `Keep water softener salt topped up and calibrate dishwashers to ${defaultBoschSetting}. Protect combi boiler heat exchangers under BS 7593.`
                  : isModerate
                  ? `Set dishwashers to ${defaultBoschSetting} to avoid cloudy glassware, and check boiler inhibitor levels at your annual service.`
                  : `Dishwasher salt top-up is optional or minimal (setting ${defaultBoschSetting}). Boilers operate at peak thermal efficiency without scale.`}
              </p>
            </div>
          </div>
        </section>

        {/* LOCAL LEAD CAPTURE ENGINE: WATER SOFTENER & HEATING PROTECTION */}
        <div className="mb-8">
          <QuoteRequestCard
            outcode={outcode.toUpperCase()}
            avgPpm={avgPpm}
            locationName={companyName}
          />
        </div>

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

        {/* LEVER 1: DISTRICT HYDRO-PROFILE & DISTRIBUTION TABLE (DATA AGGREGATION) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-8 overflow-x-auto">
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" /> Comprehensive Sector Data Aggregation
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Outcode {outcode} Water Quality & Mineral Profile
          </h3>
          <p className="text-xs text-slate-500 mb-6 max-w-2xl">
            Statistical distribution across all {totalSectors} postcode sectors and {totalPostcodes.toLocaleString()} delivery points under {companyName}&apos;s catchment monitoring:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Analyzed Sectors</span>
              <span className="text-2xl font-black text-slate-900 block mt-1">{totalSectors}</span>
              <span className="text-slate-500 text-[11px] block mt-0.5">{totalPostcodes.toLocaleString()} postcodes</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">PPM Spread (Min - Max)</span>
              <span className="text-2xl font-black text-cyan-700 block mt-1">{softestPpm} – {hardestPpm}</span>
              <span className="text-slate-500 text-[11px] block mt-0.5">Variance: {varianceDelta} PPM</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Predominant Zone</span>
              <span className="text-2xl font-black text-slate-900 block mt-1">{hardnessCategoryText}</span>
              <span className="text-slate-500 text-[11px] block mt-0.5">{hardOrVeryHardPercent}% hard/very hard</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Regulating Authority</span>
              <span className="text-lg font-black text-slate-900 block mt-1 truncate">{companyName}</span>
              <span className="text-slate-500 text-[11px] block mt-0.5">DWI Regulated Supply</span>
            </div>
          </div>

          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Hydro Metric</th>
                <th className="py-3 px-4">Outcode {outcode} Level</th>
                <th className="py-3 px-4">UK National Reference</th>
                <th className="py-3 px-4 text-right">Regional Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Mean Mineral Density</td>
                <td className="py-3 px-4 font-black text-cyan-700">{avgPpm} PPM ({clarkDegrees} °Clark)</td>
                <td className="py-3 px-4 text-slate-500">200 PPM (14.0 °Clark)</td>
                <td className={`py-3 px-4 text-right font-bold ${isHarderThanUK ? "text-rose-600" : isSofterThanUK ? "text-emerald-600" : "text-slate-900"}`}>
                  {isHarderThanUK ? `+${diffVsUK}% above baseline` : isSofterThanUK ? `${diffVsUK}% below baseline` : "At UK baseline"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">French & German Scale</td>
                <td className="py-3 px-4">{frenchDegrees} °fH / {germanDegrees} °dH</td>
                <td className="py-3 px-4 text-slate-500">20.0 °fH / 11.2 °dH</td>
                <td className="py-3 px-4 text-right text-slate-600 font-medium">European standard conversion</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Catchment Uniformity</td>
                <td className="py-3 px-4">{isUniformCatchment ? "Uniform (Single primary source)" : `Variable (${varianceDelta} PPM disparity)`}</td>
                <td className="py-3 px-4 text-slate-500">Regional blending standard</td>
                <td className="py-3 px-4 text-right font-semibold text-slate-800">{isUniformCatchment ? "Single Water Zone" : `${totalSectors} Sub-catchments`}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Dishwasher Salt Calibration</td>
                <td className="py-3 px-4 font-bold text-cyan-700">{defaultBoschSetting}</td>
                <td className="py-3 px-4 text-slate-500">Bosch H03 / Beko Level 2</td>
                <td className="py-3 px-4 text-right text-slate-800 font-medium">{isSoft || isVerySoft ? "Salt optional" : "Salt required"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SEO ARTICLE CHUYÊN SÂU ĐỘC BẢN */}
        <article className="prose prose-slate max-w-none text-slate-700 mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm leading-relaxed text-base sm:text-lg space-y-4">
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

        {/* LEVER 2: ANNUAL DISTRICT COST IMPACT (HOUSEHOLD ECONOMIC BURDEN) */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-8 border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Flame className="w-4 h-4" /> Estimated Annual Household Financial Impact
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
            Limescale & Appliance Operating Costs in Outcode {outcode}
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mb-6 max-w-2xl leading-relaxed">
            Based on {avgPpm} PPM mineral saturation ({hardnessCategoryText}), operating heating appliances across {outcode}&apos;s {totalPostcodes.toLocaleString()} households carries distinct annual economic consequences:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-200">
            <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Extra Combi Boiler Gas Cost</span>
              <span className="text-2xl sm:text-3xl font-black text-white block mt-1">{annualGasPenalty}</span>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {isHard || isVeryHard
                  ? "Thermal heating transfer resistance caused by 1mm–1.5mm calcium carbonate build-up on heat exchangers."
                  : "Negligible heat exchanger limescale layer; boilers maintain optimal seasonal fuel efficiency."}
              </p>
            </div>

            <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Dishwasher Salt Requirement</span>
              <span className="text-2xl sm:text-3xl font-black text-white block mt-1">{annualSaltConsumption}</span>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {isHard || isVeryHard
                  ? "Essential ion-exchange resin bed regeneration salt required to avoid glass clouding and element burnout."
                  : "Soft water requires minimal or zero softener regeneration salt, cutting annual consumable costs."}
              </p>
            </div>

            <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Heating Element Degradation</span>
              <span className="text-lg font-bold text-white block mt-1">{boilerEfficiencyLoss} thermal drag</span>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {applianceLifespanImpact}.
              </p>
            </div>
          </div>
        </section>

        {/* DÒNG XÁC NHẬN TÁC GIẢ EEAT & OUTBOUND CITATIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 mb-12 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-cyan-400 rounded-full flex items-center justify-center font-black text-xs shrink-0 border border-slate-800">
              WQ
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Updated: {dateModifiedFormatted} • Verified Against DWI & BS 7593 Standards
              </span>
              <Link href="/about" className="font-bold text-slate-900 hover:text-cyan-600 transition-colors text-sm">
                WaterHardness.uk Technical & Water Quality Research Team
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold">
            <a
              href="https://www.dwi.gov.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-cyan-600 transition-colors inline-flex items-center gap-1"
            >
              <span>Drinking Water Inspectorate (DWI)</span>
              <ArrowRight className="w-3 h-3" />
            </a>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <a
              href="https://www.ciphe.org.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-cyan-600 transition-colors inline-flex items-center gap-1"
            >
              <span>British Standard BS 7593</span>
              <ArrowRight className="w-3 h-3" />
            </a>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <Link href="/about" className="text-cyan-600 font-bold hover:underline">
              Methodology →
            </Link>
          </div>
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

        {/* LEVER 4: HIGHLIGHT SECTOR MỀM NHẤT VS CỨNG NHẤT / UNIFORM CORRIDOR */}
        {isUniformCatchment ? (
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center text-cyan-600 shrink-0">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-cyan-50 text-cyan-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-cyan-200 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" /> Uniform Water Quality Corridor
                  </div>
                  <h2 className="font-bold text-slate-900 text-xl">Consistent Catchment Zone Across Outcode {outcode}</h2>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="font-black text-2xl text-cyan-700 block">{avgPpm} PPM</span>
                <span className="text-xs font-semibold text-slate-500 block">{clarkDegrees} °Clark • {hardnessCategoryText}</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tap water throughout outcode {outcode} is supplied from a unified distribution network managed by {companyName}. With {isSingleSector ? `sector ${sectorsList[0]?.sector || outcode}` : `all ${totalSectors} sectors`} presenting an identical mineral concentration of {avgPpm} PPM, households across all {totalPostcodes.toLocaleString()} postcodes share uniform limescale risk profiles and identical appliance salt calibrations ({defaultBoschSetting}).
            </p>
          </section>
        ) : (
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
        )}

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