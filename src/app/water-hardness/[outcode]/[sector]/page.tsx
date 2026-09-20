import { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { getSectorData, getTopSectorsForBuild } from "@/lib/data";
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
  MapPin,
  Flame,
  Activity,
  Building2,
  ExternalLink
} from "lucide-react";

// BẬT ISR: Cache trang Sector trên CDN trong 24 tiếng
export const revalidate = 86400; 
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ outcode: string; sector: string }> | { outcode: string; sector: string };
}

// BỌC CACHE REACT ĐỂ TRÁNH TRUY VẤN KÉP TRONG 1 REQUEST
const fetchSectorDetails = cache(async (rawSector: string) => {
  const cleanSectorStr = rawSector.replace(/-/g, " ").trim().toUpperCase();
  return await getSectorData(cleanSectorStr);
});

// Hàm tạo Seed Hash tất định từ chuỗi dữ liệu
function generateCompositeSeed(inputStr: string): number {
  let hash = 2166136261;
  for (let i = 0; i < inputStr.length; i++) {
    hash ^= inputStr.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash);
}

// Pre-build các trang Sector quan trọng
export async function generateStaticParams() {
  const topSectors = await getTopSectorsForBuild();

  return topSectors.map((item) => ({
    outcode: item.outcode.toLowerCase(),
    sector: item.sector.toLowerCase().replace(/\s+/g, "-"),
  }));
}

// TỐI ƯU METADATA VÀ KHÓA INDEX TRONG GIAI ĐOẠN 1
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await fetchSectorDetails(resolvedParams.sector);

  if (!data) return { title: "Postcode Sector Not Found - WaterHardness.uk" };

  const canonicalOutcode = data.outcode.toLowerCase();
  const canonicalSectorSlug = data.sector.toLowerCase().replace(/\s+/g, "-");

  return {
    title: `${data.sector} Water Hardness (${data.avgPpm} PPM)`,
    description: `Check water hardness in ${data.sector} (${data.avgPpm} PPM, ${data.companyName}). Get dishwasher salt settings, boiler protection tips & limescale advice.`,
    
    // 🔥 LÁ CHẮN BẢO VỆ DOMAIN: Chặn Google index 9.000 trang Sector lúc web còn mới
    // Googlebot có bấm vào link xem thì cũng không tính điểm phạt Thin Content / Spam
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },

    alternates: {
      canonical: `https://waterhardness.uk/water-hardness/${canonicalOutcode}/${canonicalSectorSlug}`,
    },
    openGraph: {
      title: `${data.sector} Water Hardness (${data.avgPpm} PPM)`,
      description: `Official water hardness report for sector ${data.sector}: ${data.avgPpm} PPM (${data.clarkDegrees}° Clark). Check limescale risks & appliance settings.`,
      url: `https://waterhardness.uk/water-hardness/${canonicalOutcode}/${canonicalSectorSlug}`,
      siteName: "WaterHardness.uk",
      locale: "en_GB",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.sector} Water Hardness (${data.avgPpm} PPM)`,
      description: `Water hardness & appliance salt settings for sector ${data.sector} (${data.companyName}).`,
    },
  };
}

// MAIN SERVER COMPONENT
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
  // 🔥 MA TRẬN TÍNH TOÁN DỮ LIỆU ĐA TẦNG (ANTI-HCU & ANTI-THIN CONTENT MATRIX)
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

  // 1. Phân tầng độ cứng 5 mức chi tiết
  const isVerySoft = avgPpm < 60;
  const isSoft = avgPpm >= 60 && avgPpm < 100;
  const isModerate = avgPpm >= 100 && avgPpm < 200;
  const isHard = avgPpm >= 200 && avgPpm < 300;
  const isVeryHard = avgPpm >= 300;

  // 2. Chuyển đổi các hệ đo độ cứng nước phổ biến tại Anh và Châu Âu
  const frenchDegrees = (avgPpm * 0.1).toFixed(1);
  const germanDegrees = (avgPpm * 0.056).toFixed(1);

  // 3. Tính toán tác động nhiệt và định lượng chất tẩy rửa
  const boilerLossPercentage = isVerySoft ? "0%" : isSoft ? "< 2%" : isModerate ? "4% – 7%" : isHard ? "10% – 15%" : "18% – 25%+";
  const soapDosageAdvice = isVerySoft || isSoft 
    ? "standard or reduced detergent dosage (saving up to 30% annually)" 
    : isModerate 
    ? "medium detergent volume with routine machine descaling" 
    : isHard 
    ? "+35% extra laundry detergent to overcome calcium neutralization" 
    : "+50% extra detergent alongside dedicated limescale inhibitors";

  // 4. Phân tích địa lý & nguồn nước địa phương tại Anh
  const latStr = latitude ? latitude.toFixed(4) : "54.0000";
  const lngStr = longitude ? Math.abs(longitude).toFixed(4) : "2.0000";
  const lngDirection = longitude && longitude < 0 ? "W" : "E";

  const isSouthernChalkBelt = (companyName.includes("Thames") || companyName.includes("Anglian") || companyName.includes("Affinity") || companyName.includes("Southern") || companyName.includes("South East"));
  const isNorthernOrGranite = (companyName.includes("Scottish") || companyName.includes("United Utilities") || companyName.includes("Northumbrian") || (latitude && latitude > 54.0));
  const isMidlandsOrWelsh = (companyName.includes("Severn Trent") || companyName.includes("Welsh") || companyName.includes("Hafren"));

  // 5. Seed Hash tất định
  const compositeKey = `${sector}-${companyName}-${avgPpm}-${clarkDegrees}-${latitude}-${longitude}-${postcodeCount}`;
  const seed = generateCompositeSeed(compositeKey);
  const spintax = (options: string[], offset: number = 0) => options[(seed + offset) % options.length];

  // --- ĐOẠN 1: TỔNG QUAN VÙNG & ĐỊA LÝ CẤP NƯỚC (6 Biến thể cấu trúc) ---
  const intros = [
    `Public water quality records published by ${companyName} indicate that tap water across postcode sector ${sector} registers an average mineral hardness of ${avgPpm} PPM (mg/L of calcium carbonate). Serving approximately ${postcodeCount} postal units in the ${outcode} area, this sector falls within the official ${hardnessCategory.toLowerCase()} water classification.`,
    `Covering ${postcodeCount} active delivery postcodes in the ${outcode} district, households and businesses in sector ${sector} are supplied with tap water averaging ${avgPpm} PPM (${clarkDegrees}° Clark). Distributed under the regulatory oversight of ${companyName}, local tap water supplies in this catchment are rated as ${hardnessCategory.toLowerCase()}.`,
    `For residents configuring home appliances or monitoring water quality in ${sector}, environmental supply metrics from ${companyName} show a dissolved mineral density of ${avgPpm} PPM. Spanning ${postcodeCount} local postcodes, the mains tap water supply presents a consistent ${hardnessCategory.toLowerCase()} profile.`,
    `Water testing audits for postcode sector ${sector} confirm a mean calcium carbonate concentration of ${avgPpm} PPM, equivalent to ${clarkDegrees}° Clark or ${frenchDegrees}°fH. Sourced and treated by ${companyName} across ${postcodeCount} postcode delivery routes, water in this catchment is categorized as ${hardnessCategory.toLowerCase()}.`,
    `Serving the community across sector ${sector}, mains tap water is supplied by ${companyName}. Across the ${postcodeCount} postcodes within this distribution boundary, the baseline water hardness currently averages ${avgPpm} PPM, falling into the ${hardnessCategory.toLowerCase()} threshold.`,
    `According to regional catchment disclosures for ${sector}, municipal tap water managed by ${companyName} presents a mineral density of ${avgPpm} PPM (${clarkDegrees} English degrees). This data covers approximately ${postcodeCount} residential and commercial addresses in the ${outcode} area.`
  ];
  const paragraphIntro = spintax(intros, 0);

  // --- ĐOẠN 2: PHÂN TÍCH TÁC ĐỘNG TỔN THẤT NHIỆT & LÒ HƠI BOILER ---
  const limescaleTemplates = isVeryHard ? [
    `At ${avgPpm} PPM, sector ${sector} is situated in a high-density mineral corridor. Heating water above 60°C precipitates heavy calcium carbonate scale directly onto combi boiler heat exchangers, immersion coils, and kettle bases. Without preventative scale treatment, internal pipe encrustation can degrade thermal heating efficiency by ${boilerLossPercentage}, leading to elevated quarterly energy expenses across ${sector}&apos;s ${postcodeCount} postcodes.`,
    `With an intense mineral load of ${avgPpm} PPM (${clarkDegrees}° Clark), households in ${sector} face rapid limescale deposition. Dissolved calcium and magnesium leave thick chalky residue on shower screens, aerators, and heating elements while reducing central heating boiler efficiency by up to ${boilerLossPercentage}.`
  ] : isHard ? [
    `Registering ${avgPpm} PPM, tap water across ${sector}&apos;s ${postcodeCount} postcodes carries significant calcium concentrations. Uninhibited hot water use accelerates limescale deposits on heating elements, potentially causing a ${boilerLossPercentage} loss in boiler heat transfer efficiency over prolonged operating cycles.`,
    `Because water supplied by ${companyName} in ${sector} contains ${avgPpm} PPM of dissolved minerals, limescale accumulation is an active maintenance factor. Taps, thermostatic shower cartridges, and boiler coils require periodic descaling to prevent flow constriction.`
  ] : isModerate ? [
    `With a balanced reading of ${avgPpm} PPM (${clarkDegrees}° Clark), water in ${sector} exhibits a moderate mineral structure. While limescale accumulation is gradual, minor scale rings can form inside kettles and on boiler heat exchangers over 6–12 month periods (estimated thermal efficiency drag of ${boilerLossPercentage}).`,
    `Tap water in sector ${sector} averages ${avgPpm} PPM, presenting a manageable mineral level for the ${postcodeCount} local postcodes. Heating equipment operates with negligible efficiency loss (${boilerLossPercentage}), though routine quarterly inspection of kettle elements remains beneficial.`
  ] : [ // isSoft or isVerySoft
    `Benefiting from a low mineral concentration of just ${avgPpm} PPM, tap water in ${sector} is naturally soft. Heating systems and hot water cylinders across these ${postcodeCount} postcodes operate at peak thermal efficiency (${boilerLossPercentage} scale-related losses), virtually eliminating limescale buildup on pipework.`,
    `Supplied by ${companyName} at ${avgPpm} PPM (${clarkDegrees}° Clark), water in sector ${sector} does not produce stubborn chalky encrustations. Homeowners enjoy extended appliance lifespans and clean boiler pipework without requiring chemical water softeners.`
  ];
  const paragraphLimescale = spintax(limescaleTemplates, 1);

  // --- ĐOẠN 3: NGUỒN NƯỚC ĐỊA CHẤT & ĐẶC THÙ NHÀ MÁY NƯỚC (CONDITIONAL GEOLOGICAL INSIGHT) ---
  let paragraphGeology = "";
  if (isSouthernChalkBelt) {
    paragraphGeology = `Water distributed by ${companyName} in this southeastern/eastern catchment is predominantly drawn from underground chalk and limestone aquifers. As rainwater filters through deep subterranean chalk strata, it naturally dissolves high concentrations of calcium bicarbonate, resulting in the consistent ${avgPpm} PPM profile recorded across sector ${sector}.`;
  } else if (isNorthernOrGranite) {
    paragraphGeology = `The water supply managed by ${companyName} in this region is primarily abstracted from upland reservoirs, lakes, and moorland catchments with impermeable granite or sandstone geology. This geological pathway limits mineral leaching, maintaining a low-to-moderate hardness baseline of ${avgPpm} PPM throughout ${sector}.`;
  } else if (isMidlandsOrWelsh) {
    paragraphGeology = `Supplies in this zone are managed through a composite blend of river abstraction points and upland reservoirs operated by ${companyName}. The mineral balance fluctuates moderately between seasons, averaging ${avgPpm} PPM (${clarkDegrees}° Clark) across the ${postcodeCount} postal sectors in this supply matrix.`;
  } else {
    paragraphGeology = `Water quality in ${sector} is monitored continuously under the Water Supply (Water Quality) Regulations. Environmental testing ensures that the ${avgPpm} PPM mineral density supplied by ${companyName} remains compliant with all Drinking Water Inspectorate (DWI) parameters.`;
  }

  // --- ĐOẠN 4: HÓA HỌC CHẤT TẨY RỬA, TÓC & DA (DETERGENT & BATHING IMPACT) ---
  const skinSoapTemplates = [
    `In everyday household use, calcium and magnesium ions in ${avgPpm} PPM water bind with soaps, producing chalky bathroom residue and scum on your morning cuppa. In sector ${sector}, washing laundry or dishware requires ${soapDosageAdvice}. For personal grooming, individuals with dry skin or eczema sensitivity may experience skin tightness after showers in this ${hardnessCategory.toLowerCase()} water environment.`,
    `Bathing and laundering across the ${postcodeCount} postcodes of ${sector} is influenced by the ${avgPpm} PPM mineral density. Surfactants in shampoos and detergents interact with calcium salts, requiring ${soapDosageAdvice} to achieve thorough cleansing and preserve fabric softness.`,
    `Household water chemistry in ${sector} (${clarkDegrees}° Clark) dictates everyday cleaning efficiency. Water supplied by ${companyName} at this level necessitates ${soapDosageAdvice}, while inline shower head filters can help sensitive skin by mitigating mineral residue during washing.`
  ];
  const paragraphSkinSoap = spintax(skinSoapTemplates, 2);

  // --- ĐOẠN 5: CÀI ĐẶT MÁY MÓC & HƯỚNG DẪN BẢO VỆ THIẾT BỊ ---
  const applianceGuidanceTemplates = [
    `To preserve internal ion-exchange resin chambers, domestic dishwashers operating in sector ${sector} should be calibrated precisely for ${avgPpm} PPM. For Bosch, Neff, and Siemens appliances, the recommended salt dosing index is ${boschSaltSetting || (isSoft ? "H00" : "H04")}. Explore our interactive configuration tool below to verify exact settings for Beko, Miele, and Whirlpool units.`,
    `Calibrating appliance water softening systems in ${sector} prevents etched glassware and heating element burnouts. Based on ${companyName}&apos;s official ${avgPpm} PPM rating, Bosch dishwashers should be set to ${boschSaltSetting || (isSoft ? "H00" : "H04")}. Consult the interactive equipment guide below for custom brand settings across all ${postcodeCount} postcodes.`,
    `Correct softener regeneration is critical when running appliances on ${avgPpm} PPM water in ${sector}. Setting your dishwasher to ${boschSaltSetting || (isSoft ? "H00" : "H04")} optimizes salt consumption while ensuring spot-free drying results across ${outcode}.`
  ];
  const paragraphApplianceGuidance = spintax(applianceGuidanceTemplates, 3);

  // FAQ Items
  const faqItems = [
    {
      question: `What is the official water hardness level in sector ${sector}?`,
      answer: `Tap water in sector ${sector} has an average mineral density of ${avgPpm} PPM (mg/L), which equals ${clarkDegrees}° Clark, ${frenchDegrees}°fH, or ${germanDegrees}°dH. It is officially categorized as ${hardnessCategory.toLowerCase()} water supplied by ${companyName}.`,
    },
    {
      question: `What dishwasher water softener setting is needed for ${sector}?`,
      answer: `For Bosch, Siemens, and Neff dishwashers in sector ${sector} (${avgPpm} PPM), the recommended softener setting is ${boschSaltSetting || (isSoft ? "H00 (No Salt Required)" : "H04")}. Beko models typically require Level ${isSoft ? "1" : isModerate ? "2" : "3 or 4"}.`,
    },
    {
      question: `Will hard water damage central heating boilers in ${sector}?`,
      answer: isVerySoft || isSoft
        ? `No. Because water in ${sector} is soft (${avgPpm} PPM), limescale accumulation inside boiler heat exchangers is minimal, allowing heating equipment to maintain standard thermal efficiency.`
        : `Yes. At ${avgPpm} PPM, calcium carbonate precipitation will build scale layers on heating elements over time, potentially reducing boiler heat transfer efficiency by ${boilerLossPercentage} without proper filtration or descaling.`,
    },
    {
      question: `Who is the regulated water supplier for sector ${sector}?`,
      answer: `Mains water across postcode sector ${sector} is distributed and monitored by ${companyName} in accordance with Drinking Water Inspectorate (DWI) quality standards.`,
    }
  ];

  // Lấy ngày tháng SEO tất định theo Sector
  const { datePublishedISO, dateModifiedISO, dateModifiedFormatted } = getSeoDates(sector);

  // Schema JSON-LD chuẩn @graph với QuantitativeValue & PropertyValue
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://waterhardness.uk/water-hardness/${canonicalOutcode}/${canonicalSectorSlug}#webpage`,
        "url": `https://waterhardness.uk/water-hardness/${canonicalOutcode}/${canonicalSectorSlug}`,
        "name": `Sector ${sector} Water Hardness Report (${avgPpm} PPM)`,
        "isPartOf": { "@id": "https://waterhardness.uk/#website" },
        "breadcrumb": { "@id": `https://waterhardness.uk/water-hardness/${canonicalOutcode}/${canonicalSectorSlug}#breadcrumb` }
      },
      {
        "@type": "Article",
        "@id": `https://waterhardness.uk/water-hardness/${canonicalOutcode}/${canonicalSectorSlug}#article`,
        "headline": `Water Hardness in Sector ${sector}: ${avgPpm} PPM Quality Report`,
        "description": `Comprehensive water hardness metrics, mineral PPM ratings, and dishwasher salt settings for sector ${sector} (${companyName}).`,
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
          "@id": "https://waterhardness.uk/#organization",
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
            "name": `Postcode Sector ${sector}`,
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": latitude || 54.0,
              "longitude": longitude || -2.0
            }
          },
          {
            "@type": "PropertyValue",
            "name": "Water Hardness",
            "value": avgPpm,
            "unitText": "mg/L CaCO3",
            "description": `${hardnessCategory} water supplied by ${companyName}`
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://waterhardness.uk/water-hardness/${canonicalOutcode}/${canonicalSectorSlug}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://waterhardness.uk" },
          { "@type": "ListItem", "position": 2, "name": "All Outcodes", "item": "https://waterhardness.uk/outcodes" },
          { "@type": "ListItem", "position": 3, "name": `Outcode ${outcode}`, "item": `https://waterhardness.uk/water-hardness/${canonicalOutcode}` },
          { "@type": "ListItem", "position": 4, "name": `Sector ${sector}`, "item": `https://waterhardness.uk/water-hardness/${canonicalOutcode}/${canonicalSectorSlug}` }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `https://waterhardness.uk/water-hardness/${canonicalOutcode}/${canonicalSectorSlug}#faq`,
        "mainEntity": faqItems.map((f) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      }
    ]
  };

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
            Water Supply Zone Report • Distribution Area Managed by <strong className="text-slate-800">{companyName}</strong>
          </p>
        </div>

        {/* QUICK SNAPSHOT METRICS CARD */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl mb-8 shadow-md border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-800 pb-4">
            <h2 className="text-cyan-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Water Quality Summary: Sector {sector}
            </h2>
            <div>
              {dataPrecision === "zone_level" ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[11px] font-bold">
                  ✓ Verified Zone-Level Data (DWI / Defra)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-[11px] font-medium">
                  ⓘ Regional Catchment Estimate ({companyName})
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-sm">
            <div>
              <span className="text-slate-400 text-xs block font-medium">Average Mineral PPM</span>
              <span className="text-3xl font-black text-white block mt-1">{avgPpm} PPM</span>
              <span className="text-cyan-400 text-[11px] block mt-0.5 font-bold">{hardnessCategory}</span>
            </div>

            <div>
              <span className="text-slate-400 text-xs block font-medium">English Clark Scale</span>
              <span className="text-3xl font-black text-white block mt-1">{clarkDegrees} °Clark</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">{frenchDegrees} °fH • {germanDegrees} °dH</span>
            </div>

            <div>
              <span className="text-slate-400 text-xs block font-medium">Boiler Heat Loss</span>
              <span className="text-3xl font-black text-amber-400 block mt-1">{boilerLossPercentage}</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">Est. thermal efficiency drag</span>
            </div>

            <div>
              <span className="text-slate-400 text-xs block font-medium">Bosch Dishwasher Setting</span>
              <span className="text-3xl font-black text-cyan-400 block mt-1">{boschSaltSetting || "H00"}</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">
                {isSoft || isVerySoft ? "Salt optional" : "Softener salt required"}
              </span>
            </div>
          </div>
        </div>

        {/* DIRECT ANSWER CITABILITY BLOCK (AI OVERVIEWS & FEATURED SNIPPETS) */}
        <section className="bg-cyan-50 border-2 border-cyan-200 rounded-3xl p-6 sm:p-7 mb-8 text-slate-800">
          <div className="flex items-center gap-2 text-cyan-800 font-bold text-xs uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-600" />
            <span>Direct Answer & Quick Diagnostic</span>
          </div>
          <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-900">
            Tap water in postcode sector <strong>{sector}</strong> has an average water hardness of <strong>{avgPpm} PPM</strong> (mg/L CaCO₃), which equals <strong>{clarkDegrees}° Clark</strong> ({frenchDegrees}°fH / {germanDegrees}°dH). Classified as <strong>{hardnessCategory.toLowerCase()}</strong> water distributed by <strong>{companyName}</strong>, domestic dishwashers require setting <strong>{boschSaltSetting || (isSoft ? "H00" : "H04")}</strong> and combi boilers face an estimated thermal efficiency drag of <strong>{boilerLossPercentage}</strong> without scale protection.
          </p>
        </section>

        {/* SEO ARTICLE DÀY ĐẶN - NỘI DUNG ĐA TẦNG CHỐNG HCU */}
        <article className="prose prose-slate max-w-none text-slate-700 mb-8 leading-relaxed text-base sm:text-lg bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> Comprehensive Hydro-Geological Analysis
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 border-b border-slate-200 pb-2">
            Water Hardness Breakdown for Sector {sector}
          </h2>
          
          <p>{paragraphIntro}</p>
          <p>{paragraphLimescale}</p>
          <p>{paragraphGeology}</p>
          <p>{paragraphSkinSoap}</p>
          <p>{paragraphApplianceGuidance}</p>
        </article>

        {/* MULTI-UNIT METRIC CONVERSION TABLE FOR CITABILITY & AI OVERVIEWS */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-10 overflow-x-auto">
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" /> Standardized Water Chemistry Metrics
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
            Water Hardness Measurement Conversions for Sector {sector}
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Standardised unit equivalents used across British plumbing standards (BS 7593), European appliance manuals, and water testing:
          </p>
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Measurement Scale</th>
                <th className="py-3 px-4">Symbol / Standard</th>
                <th className="py-3 px-4 text-right">Value in {sector}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Parts Per Million (UK/US standard)</td>
                <td className="py-3 px-4 font-mono text-slate-500">PPM / mg/L CaCO₃</td>
                <td className="py-3 px-4 text-right font-black text-cyan-700">{avgPpm} PPM</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">English Clark Degrees</td>
                <td className="py-3 px-4 font-mono text-slate-500">°Clark / °e</td>
                <td className="py-3 px-4 text-right font-bold">{clarkDegrees} °Clark</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">French Degrees</td>
                <td className="py-3 px-4 font-mono text-slate-500">°fH</td>
                <td className="py-3 px-4 text-right font-bold">{frenchDegrees} °fH</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">German Degrees (General Hardness)</td>
                <td className="py-3 px-4 font-mono text-slate-500">°dH / dGH</td>
                <td className="py-3 px-4 text-right font-bold">{germanDegrees} °dH</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Millimoles Per Litre</td>
                <td className="py-3 px-4 font-mono text-slate-500">mmol/L</td>
                <td className="py-3 px-4 text-right font-bold">{(avgPpm * 0.01).toFixed(2)} mmol/L</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Grains Per Gallon (US)</td>
                <td className="py-3 px-4 font-mono text-slate-500">gpg</td>
                <td className="py-3 px-4 text-right font-bold">{(avgPpm / 17.118).toFixed(1)} gpg</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* KHỐI TÁC GIẢ E-E-A-T & AUTHORITY CITATIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 mb-8 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-cyan-400 rounded-full flex items-center justify-center font-black text-sm shrink-0 border border-slate-800">
              NP
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Updated: {dateModifiedFormatted} • DWI & Defra Compliant Data
              </span>
              <Link href="/about" className="font-bold text-slate-900 hover:text-cyan-600 transition-colors text-sm">
                Nguyễn Hạc Phong <span className="text-slate-400 font-normal text-xs">• Lead Water Data Engineer</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href="https://www.dwi.gov.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-cyan-600 transition-colors inline-flex items-center gap-1"
            >
              <span>Drinking Water Inspectorate (DWI)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <Link href="/about" className="text-cyan-600 font-bold hover:underline hidden sm:inline">
              Methodology & Sources →
            </Link>
          </div>
        </div>

        {/* CLIENT COMPONENT INTERACTIVE (GAUGE BAR + BRAND SELECTOR + AFFILIATE) */}
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

        {/* CTA CROSS-LINKING COMPARISON */}
        <div className="mt-8 bg-cyan-50 p-6 sm:p-8 rounded-3xl border border-cyan-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Curious how Sector {sector} compares?</h3>
            <p className="text-sm text-slate-600 mt-1">
              Compare your local mineral PPM, boiler efficiency risks, and appliance settings directly against Central London (SW1A 1).
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