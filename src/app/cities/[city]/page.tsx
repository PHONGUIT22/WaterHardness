import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { citiesData, getCityBySlug } from "@/lib/citiesData";
import { findSupplierByName } from "@/lib/suppliersData";
import { getOutcodesForCity } from "@/lib/data";
import { getSeoDates } from "@/lib/seoDates";
import CityOutcodeGrid from "./CityOutcodeGrid";
import QuoteRequestCard from "@/components/lead/QuoteRequestCard";
import { WaterHardnessGauge } from "@/components/visual";
import { getGuidesByCity } from "@/lib/guidesData";
import {
  Droplets,
  ShieldCheck,
  Scale,
  Flame,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  Info,
  Building2,
  TrendingUp,
  TrendingDown,
  WashingMachine,
  Coffee,
  ExternalLink,
  Shield,
  BookOpen,
  ArrowRight
} from "lucide-react";

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  return citiesData.map((c) => ({
    city: c.slug,
  }));
}

interface PageProps {
  params: Promise<{ city: string }> | { city: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const city = getCityBySlug(resolvedParams.city);

  if (!city) {
    return {
      title: "City Water Hardness Guide Not Found",
    };
  }

  // Determine hardness classification label based on PPM
  const hardnessLabel = city.avgPpm < 100 ? "(Soft)" : city.avgPpm < 200 ? "(Moderate)" : "(Hard)";

  // Ensure title with brand suffix " | WaterHardness.uk" (18 chars) stays strictly <= 58 chars total
  const fullBaseTitle = `${city.name} Water Hardness: ${city.avgPpm} PPM ${hardnessLabel}`;
  const shortBaseTitle = `${city.name} Water: ${city.avgPpm} PPM ${hardnessLabel}`;
  const baseTitle = fullBaseTitle.length <= 40 ? fullBaseTitle : shortBaseTitle;
  const absoluteTitle = `${baseTitle} | WaterHardness.uk`;

  return {
    title: { absolute: absoluteTitle },
    description: city.metaDescription,
    alternates: {
      canonical: `https://waterhardness.uk/cities/${city.slug}`,
    },
    openGraph: {
      title: absoluteTitle,
      description: city.metaDescription,
      url: `https://waterhardness.uk/cities/${city.slug}`,
      siteName: "WaterHardness.uk",
      locale: "en_GB",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle,
      description: city.metaDescription,
    },
  };
}

export default async function CityHubPage({ params }: PageProps) {
  const resolvedParams = await params;
  const city = getCityBySlug(resolvedParams.city);

  if (!city) {
    notFound();
  }

  const outcodes = await getOutcodesForCity(city.outcodePrefixes);
  const { datePublishedISO, dateModifiedISO, dateModifiedFormatted } = getSeoDates(city.slug);
  const supplierMeta = findSupplierByName(city.supplier);
  const cityGuides = getGuidesByCity(city.slug);

  const isSoft = city.avgPpm < 100;
  const isModerate = city.avgPpm >= 100 && city.avgPpm < 200;
  const isHard = city.avgPpm >= 200 && city.avgPpm < 300;
  const isVeryHard = city.avgPpm >= 300;

  const frenchDegrees = (city.avgPpm * 0.1).toFixed(1);
  const germanDegrees = (city.avgPpm * 0.056).toFixed(1);

  // UK baseline benchmark (200 PPM)
  const UK_BENCHMARK = 200;
  const diffVsUK = Math.round(((city.avgPpm - UK_BENCHMARK) / UK_BENCHMARK) * 100);
  const isHarderThanUK = diffVsUK > 0;
  const isSofterThanUK = diffVsUK < 0;

  const varianceDelta = city.hardestArea.ppm - city.softestArea.ppm;

  // Appliance recommendations based on hardness
  const kettleDescaling = isSoft
    ? "Virtually never required. A light rinse every 4–6 months clears natural dust and loose sediment."
    : isModerate
    ? "Every 2–3 months with white vinegar or food-grade citric acid crystals."
    : isHard
    ? "Monthly descaling required. Boil one tablespoon of citric acid to dissolve crust before it flakes into morning cuppas."
    : "Every 2–3 weeks. Severe limescale crust forms quickly; use citric acid boiling regularly.";

  const dishwasherSetting = isSoft
    ? "Level 0 or 1 (Minimum). Multi-benefit all-in-one tablets supply all conditioning needed."
    : isModerate
    ? "Level 2 or 3 (Medium). Keep salt reservoir filled to protect glassware from clouding."
    : isHard
    ? "Level 4 or 5 (High). Essential to maintain ion-exchange resin bed and prevent cloudy glass etching."
    : "Level 5 or 6 (Maximum). Heavy salt consumption required; refill salt reservoir every 3–4 weeks.";

  const boilerAdvice = isSoft
    ? "Zero mineral scale drag on combi boiler heat exchangers. Maintain system corrosion inhibitor under BS 7593."
    : isModerate
    ? "Mild scale drag (~4%–6% efficiency loss). Add an in-line electrolytic scale reducer and annual inhibitor dosing."
    : isHard
    ? "High scale hazard. Up to 10%–14% fuel efficiency loss without scale protection. In-line scale reducer and BS 7593 inhibitor essential."
    : "Severe scale risk. Up to 18%+ efficiency loss. An ion-exchange water softener or chemical inhibitor is critical to protect warranties.";

  const skinAdvice = isSoft
    ? "Soaps and shampoos lather effortlessly with tiny amounts. Kind to sensitive skin and eczema sufferers."
    : isModerate
    ? "Moderate lathering. Rinses clean without heavy mineral curd residue."
    : isHard
    ? "Hard minerals bind to fatty acids, forming soap curd that strips natural moisture and irritates dry or eczema-prone skin."
    : "Aggressive mineral curd formation. Leaves a chalky film on skin; fitting a shower filter or water softener helps restore skin hydration.";

  // Schema.org JSON-LD graph
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://waterhardness.uk/cities/${city.slug}`,
        "url": `https://waterhardness.uk/cities/${city.slug}`,
        "name": `${city.name} Water Hardness Report & Postcode Guide`,
        "description": city.metaDescription,
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://waterhardness.uk"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "UK Cities",
              "item": "https://waterhardness.uk/cities"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": city.name,
              "item": `https://waterhardness.uk/cities/${city.slug}`
            }
          ]
        }
      },
      {
        "@type": "Article",
        "@id": `https://waterhardness.uk/cities/${city.slug}#article`,
        "headline": `${city.name} Water Hardness: ${city.avgPpm} PPM & Postcode Guide`,
        "description": city.metaDescription,
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
          "logo": {
            "@type": "ImageObject",
            "url": "https://waterhardness.uk/logo.png"
          }
        },
        "citation": [
          "https://www.dwi.gov.uk/",
          "https://www.ciphe.org.uk/"
        ],
        "about": [
          {
            "@type": "City",
            "name": city.name,
            "containedInPlace": {
              "@type": "AdministrativeArea",
              "name": city.region
            }
          },
          {
            "@type": "PropertyValue",
            "name": "Average Water Hardness",
            "value": city.avgPpm,
            "unitText": "mg/L CaCO3",
            "description": `${city.hardnessCategory} supplied by ${city.supplier}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `https://waterhardness.uk/cities/${city.slug}#faq`,
        "mainEntity": city.faqItems.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-slate-50 pb-16">
        {/* Breadcrumb Bar */}
        <div className="border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <Link href="/cities" className="hover:text-blue-600 transition-colors">
                UK Cities
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900">{city.name}</span>
            </nav>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          {/* Hero Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  isSoft
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : isModerate
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : isHard
                    ? "bg-orange-50 text-orange-700 border-orange-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                <Droplets className="h-3.5 w-3.5" />
                {city.hardnessCategory}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                {supplierMeta ? (
                  <Link
                    href={`/suppliers/${supplierMeta.slug}`}
                    className="hover:text-blue-600 hover:underline transition-colors font-medium"
                    title={`View ${supplierMeta.name} water hardness coverage and report`}
                  >
                    {city.supplier}
                  </Link>
                ) : (
                  city.supplier
                )}
              </span>
              <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                {city.region}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {city.name} Water Hardness Report
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-3xl">
              Official mineral water quality analysis, local catchment breakdown, appliance salt calibration, and postcode outcode directory for {city.name}.
            </p>
          </div>

          {/* Above-the-Fold Hero Verdict Box */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Primary Stat Card */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Average City Tap Water Rating
                  </span>
                  <span className="text-xs text-slate-500">
                    Updated {dateModifiedFormatted}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-3 mb-4">
                      <span className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900">
                        {city.avgPpm}
                      </span>
                      <span className="text-xl font-bold text-slate-600">PPM (mg/L CaCO3)</span>
                    </div>

                    {/* Multi-unit scales */}
                    <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <div className="text-xs text-slate-500">Clark Degrees</div>
                        <div className="text-base font-bold text-slate-900">{city.clarkDegrees}° Clark</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">French Scale</div>
                        <div className="text-base font-bold text-slate-900">{frenchDegrees}°fH</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">German Scale</div>
                        <div className="text-base font-bold text-slate-900">{germanDegrees}°dH</div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Speedometer Gauge */}
                  <div className="w-full md:w-[280px] shrink-0">
                    <WaterHardnessGauge
                      ppm={city.avgPpm}
                      outcodeOrCityName={city.name}
                      category={city.hardnessCategory}
                      showDetails={false}
                      className="p-4 border-slate-100 bg-slate-50/70 shadow-none"
                    />
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {city.editorialSummary}
                </p>
              </div>

              {/* National Benchmark Comparator */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  {isHarderThanUK ? (
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                  ) : isSofterThanUK ? (
                    <TrendingDown className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Scale className="h-4 w-4 text-blue-500" />
                  )}
                  <span>
                    <strong>
                      {Math.abs(diffVsUK)}% {isHarderThanUK ? "harder" : isSofterThanUK ? "softer" : "equal"}
                    </strong>{" "}
                    than the UK national baseline (200 PPM)
                  </span>
                </div>
                <span className="text-slate-400 hidden sm:inline">DWI Monitored</span>
              </div>
            </div>

            {/* Neighbourhood Variance Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-blue-600" />
                  Neighbourhood Hydro-Variance
                </h3>

                <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                  Water hardness across {city.name} varies by up to <strong>{varianceDelta} PPM</strong> between different treatment zones and boreholes.
                </p>

                {/* Softest Area */}
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
                    <span>Softest District</span>
                    <span>{city.softestArea.ppm} PPM</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {city.softestArea.name}
                  </div>
                </div>

                {/* Hardest Area */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 mb-6">
                  <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
                    <span>Hardest District</span>
                    <span>{city.hardestArea.ppm} PPM</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {city.hardestArea.name}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Info className="h-4 w-4 text-slate-400 inline mr-1 -mt-0.5" />
                Supplied by <strong>{city.supplier}</strong> under Drinking Water Inspectorate (DWI) regulatory standards.
              </div>
            </div>
          </div>

          {/* LOCAL LEAD CAPTURE ENGINE: WATER SOFTENER & HEATING PROTECTION */}
          <div className="mb-8">
            <QuoteRequestCard
              outcode={city.outcodePrefixes[0]}
              avgPpm={city.avgPpm}
              locationName={city.name}
            />
          </div>

          {/* Outcode Postcode Directory Grid (Step 2.3) */}
          <CityOutcodeGrid cityName={city.name} outcodes={outcodes} />

          {/* In-Depth Guide Callout Banner (Closed-Loop Topic Cluster) */}
          {city.relatedGuideSlug && (
            <div className="mb-8 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-0.5">
                    In-Depth Local Field Guide
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Looking for deeper household advice in {city.name}?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Read our comprehensive engineer report on limescale removal, water softeners, and appliance calibrations.
                  </p>
                </div>
              </div>
              <Link
                href={`/guides/${city.relatedGuideSlug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs sm:text-sm font-bold transition-all shrink-0 shadow-xs cursor-pointer"
              >
                <span>Read Full {city.name} Guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Practical Household Advice Box (Which?-style) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-8">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Which?-Style Practical Household Advice
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Living with {city.name} Tap Water: Essential Household Guide
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Practical calibrations for kitchen appliances, heating systems, and personal care tailored specifically to {city.name}&apos;s water profile.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kettle & Tea */}
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold text-base">
                  <Coffee className="h-5 w-5 text-amber-600" />
                  Kettles &amp; Hot Drinks
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {kettleDescaling}
                </p>
                <div className="text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  💡 <strong>Pro Tip:</strong> Buy food-grade citric acid powder (£5/kg) instead of chemical descaling tablets. One boiled tablespoon cleans the base in 5 minutes with zero lingering odor.
                </div>
              </div>

              {/* Dishwasher Salt */}
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold text-base">
                  <WashingMachine className="h-5 w-5 text-blue-600" />
                  Dishwasher Salt Calibration
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {dishwasherSetting}
                </p>
                <div className="text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  ⚙️ <strong>Recommended Dial Setting:</strong> {isSoft ? "Level 1 / Off" : isModerate ? "Level 2–3" : "Level 4–5"} (refer to machine manual).
                </div>
              </div>

              {/* Combi Boiler & Central Heating */}
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold text-base">
                  <Flame className="h-5 w-5 text-rose-600" />
                  Boiler Efficiency &amp; BS 7593
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {boilerAdvice}
                </p>
                <div className="text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  🛡️ <strong>Compliance:</strong> British Standard BS 7593 requires regular chemical inhibitor dosing and annual testing to prevent heat exchanger scale drag.
                </div>
              </div>

              {/* Skin & Shower Care */}
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold text-base">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Bathing, Hair &amp; Sensitive Skin
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {skinAdvice}
                </p>
                <div className="text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  🚿 <strong>Shower Screens:</strong> Use a rubber squeegee after each shower to prevent dissolved calcium from baking into the glass under hot steam.
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-8">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Common Questions
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-blue-600" />
                Frequently Asked Questions about {city.name} Tap Water
              </h2>
            </div>

            <div className="space-y-4">
              {city.faqItems.map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-xl border border-slate-200 bg-slate-50/60 open:bg-white transition-colors"
                >
                  <summary className="cursor-pointer p-4 font-bold text-slate-900 flex items-center justify-between list-none">
                    <span className="text-base">{faq.question}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* RELATED PILLAR GUIDES (CLOSED-LOOP TOPIC CLUSTER) */}
          {cityGuides.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-8">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Technical Guides &amp; Research Reports
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                In-Depth Water Quality &amp; Limescale Guides for {city.name}
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Explore verified engineering analyses, catchment breakdowns, and appliance preservation advice:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cityGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/60 hover:border-blue-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                        {guide.category} • {guide.readingTime}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                        {guide.quickVerdict.keyTakeaway}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                      <span>Read Full Guide &amp; Technical Breakdown</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* E-E-A-T Research Citation Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <div className="font-bold text-slate-900">
                  WaterHardness.uk Technical &amp; Water Quality Research Team
                </div>
                <div className="text-slate-500 mt-0.5">
                  Data sourced from{" "}
                  {supplierMeta ? (
                    <Link
                      href={`/suppliers/${supplierMeta.slug}`}
                      className="hover:text-blue-600 hover:underline font-semibold"
                    >
                      {city.supplier}
                    </Link>
                  ) : (
                    city.supplier
                  )}{" "}
                  compliance reports and Drinking Water Inspectorate (DWI) public records.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.dwi.gov.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
              >
                DWI Standards <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-slate-300">|</span>
              <Link href="/about" className="text-blue-600 hover:underline font-semibold">
                Methodology
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
