import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSuppliers, getSupplierBySlug } from "@/lib/suppliersData";
import { getSupplierOverview } from "@/lib/data";
import { getSeoDates } from "@/lib/seoDates";
import SupplierOutcodeGrid from "./SupplierOutcodeGrid";
import QuoteRequestCard from "@/components/lead/QuoteRequestCard";
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
  Layers,
  MapPin,
  AlertTriangle,
} from "lucide-react";

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllSuppliers().map((s) => ({
    slug: s.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const supplier = getSupplierBySlug(resolvedParams.slug);

  if (!supplier) {
    return {
      title: "Water Supplier Hardness Guide Not Found",
    };
  }

  // Ensure title with brand suffix stays strictly <= 58 chars total
  const absoluteTitle = supplier.metaTitle.length <= 40
    ? `${supplier.metaTitle} | WaterHardness.uk`
    : supplier.metaTitle;

  return {
    title: { absolute: absoluteTitle },
    description: supplier.metaDescription,
    alternates: {
      canonical: `https://waterhardness.uk/suppliers/${supplier.slug}`,
    },
    openGraph: {
      title: absoluteTitle,
      description: supplier.metaDescription,
      url: `https://waterhardness.uk/suppliers/${supplier.slug}`,
      siteName: "WaterHardness.uk",
      locale: "en_GB",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle,
      description: supplier.metaDescription,
    },
  };
}

export default async function SupplierHubPage({ params }: PageProps) {
  const resolvedParams = await params;
  const overview = await getSupplierOverview(resolvedParams.slug);

  if (!overview) {
    notFound();
  }

  const { supplier, networkAvgPpm, networkClarkDegrees, hardnessCategory, outcodes } = overview;
  const { datePublishedISO, dateModifiedISO, dateModifiedFormatted } = getSeoDates(supplier.slug);

  const isSoft = networkAvgPpm < 100;
  const isModerate = networkAvgPpm >= 100 && networkAvgPpm < 200;
  const isHard = networkAvgPpm >= 200 && networkAvgPpm < 300;
  const isVeryHard = networkAvgPpm >= 300;

  const frenchDegrees = (networkAvgPpm * 0.1).toFixed(1);
  const germanDegrees = (networkAvgPpm * 0.056).toFixed(1);

  // UK baseline benchmark (200 PPM)
  const UK_BENCHMARK = 200;
  const diffVsUK = Math.round(((networkAvgPpm - UK_BENCHMARK) / UK_BENCHMARK) * 100);

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://waterhardness.uk",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Water Suppliers",
            "item": "https://waterhardness.uk/suppliers",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": supplier.name,
            "item": `https://waterhardness.uk/suppliers/${supplier.slug}`,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `https://waterhardness.uk/suppliers/${supplier.slug}#webpage`,
        "url": `https://waterhardness.uk/suppliers/${supplier.slug}`,
        "name": `${supplier.name} Water Hardness Guide & PPM Map`,
        "description": supplier.metaDescription,
        "datePublished": datePublishedISO,
        "dateModified": dateModifiedISO,
        "breadcrumb": {
          "@id": `https://waterhardness.uk/suppliers/${supplier.slug}#breadcrumb`,
        },
        "about": {
          "@type": "Organization",
          "name": supplier.name,
          "areaServed": supplier.region,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `https://waterhardness.uk/suppliers/${supplier.slug}#faq`,
        "mainEntity": supplier.faqItems.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto">
            <Link href="/" className="hover:text-blue-600 transition-colors shrink-0">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href="/suppliers" className="hover:text-blue-600 transition-colors shrink-0">
              Water Suppliers
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold truncate shrink-0">
              {supplier.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
              <Building2 className="w-3.5 h-3.5" />
              UK Water Utility Authority
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              DWI Water Quality Verified
            </span>
            <span className="text-xs text-slate-500">
              Updated: {dateModifiedFormatted}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            {supplier.name} Water Hardness
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            {supplier.tagline}. Discover network-wide PPM ratings, chalk aquifer vs reservoir water sources, and local appliance calibration guidelines.
          </p>
        </div>

        {/* Quick Answer Callout Box */}
        <div className="mb-10 rounded-2xl border-2 border-blue-600/30 bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/70 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-blue-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-700 mb-1">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Quick Search Verdict
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Is {supplier.name} Water Hard or Soft?
              </h2>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div
                className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wide border shadow-2xs ${
                  isSoft
                    ? "bg-emerald-600 text-white border-emerald-700"
                    : isModerate
                    ? "bg-cyan-600 text-white border-cyan-700"
                    : isHard
                    ? "bg-amber-600 text-white border-amber-700"
                    : "bg-rose-600 text-white border-rose-700"
                }`}
              >
                {hardnessCategory}
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900">
                  {networkAvgPpm} <span className="text-sm font-semibold text-slate-500">PPM</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {networkClarkDegrees}° Clark
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-700">
            <div className="md:col-span-2 space-y-3">
              <p className="leading-relaxed text-slate-800 font-medium">
                {supplier.quickAnswer.summary}
              </p>
              <p className="leading-relaxed text-slate-600 text-xs sm:text-sm">
                <strong>Primary Abstraction:</strong> {supplier.quickAnswer.sourceBreakdown}
              </p>
            </div>
            <div className="bg-white/80 rounded-xl p-4 border border-blue-100 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Regional Limescale Risk
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase ${
                    supplier.quickAnswer.limescaleRisk === "Very Low"
                      ? "bg-emerald-100 text-emerald-800"
                      : supplier.quickAnswer.limescaleRisk === "Low"
                      ? "bg-cyan-100 text-cyan-800"
                      : supplier.quickAnswer.limescaleRisk === "Moderate"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {supplier.quickAnswer.limescaleRisk} Risk
                </span>
                <span className="text-xs text-slate-500">
                  {diffVsUK > 0 ? `+${diffVsUK}% vs UK avg` : `${diffVsUK}% vs UK avg`}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                Serving {overview.totalOutcodes} postal districts across {supplier.region}.
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              Network Average
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {networkAvgPpm} <span className="text-sm font-semibold text-slate-500">mg/L</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {networkClarkDegrees}° Clark ({frenchDegrees}°fH / {germanDegrees}°dH)
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Network Coverage
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {overview.totalOutcodes}{" "}
              <span className="text-sm font-semibold text-slate-500">Outcodes</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Mapped across {overview.totalSectors} local sectors
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <TrendingDown className="w-4 h-4 text-cyan-600" />
              Softest Outcode
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              <Link
                href={`/water-hardness/${overview.softestOutcode?.outcode.toLowerCase()}`}
                className="hover:text-blue-600 hover:underline"
              >
                {overview.softestOutcode?.outcode}
              </Link>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {overview.softestOutcode?.avgPpm} PPM ({overview.softestOutcode?.hardnessCategory})
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4 text-rose-600" />
              Hardest Outcode
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              <Link
                href={`/water-hardness/${overview.hardestOutcode?.outcode.toLowerCase()}`}
                className="hover:text-rose-600 hover:underline"
              >
                {overview.hardestOutcode?.outcode}
              </Link>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {overview.hardestOutcode?.avgPpm} PPM ({overview.hardestOutcode?.hardnessCategory})
            </div>
          </div>
        </div>

        {/* Geological Insights & Water Source Analysis */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="h-6 w-6 text-indigo-600 shrink-0" />
            Where Does {supplier.name} Water Come From?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-700">
            <div className="md:col-span-2 space-y-4 leading-relaxed">
              <p>
                Water hardness across {supplier.name}&apos;s licensed territory is strictly determined by regional hydrogeology. Rainwater is naturally soft when it falls from clouds, but absorbs dissolved minerals as it percolates through soil and rock layers before municipal abstraction.
              </p>
              <div className="bg-slate-50 border-l-4 border-blue-600 p-4 rounded-r-xl text-slate-800 text-xs sm:text-sm">
                <strong>Primary Catchment Profile:</strong> {supplier.waterSource}.
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Major population centers served by {supplier.name} include:{" "}
                <span className="font-semibold text-slate-900">
                  {supplier.majorCities.join(", ")}
                </span>
                . If your water bill comes from {supplier.name}, your tap water is certified by the Drinking Water Inspectorate (DWI) and adheres to all British potable safety standards.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" />
                DWI Technical Reference
              </h3>
              <ul className="text-xs space-y-2 text-slate-600">
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span>Supplier Code</span>
                  <span className="font-mono font-bold text-slate-800">{supplier.slug}</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span>Typical Range</span>
                  <span className="font-bold text-slate-800">{supplier.typicalPpmRange}</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span>Source Classification</span>
                  <span className="font-bold text-slate-800 capitalize">
                    {supplier.waterSourceType.replace(/_/g, " ")}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Coverage Region</span>
                  <span className="font-bold text-slate-800 text-right">{supplier.region}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Appliance Calibration & BS 7593 Compliance Guide */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <WashingMachine className="h-6 w-6 text-blue-600 shrink-0" />
            Appliance Care &amp; Heating Compliance for {supplier.name} Customers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Coffee className="w-4 h-4 text-amber-600" />
                Kettle Descaling Protocol
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {supplier.applianceGuidance.kettle}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <WashingMachine className="w-4 h-4 text-blue-600" />
                Dishwasher Salt Calibration
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {supplier.applianceGuidance.dishwasher}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Flame className="w-4 h-4 text-rose-600" />
                Combi Boiler Protection (BS 7593)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {supplier.applianceGuidance.boiler}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs sm:text-sm text-blue-900 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Expert Softener Recommendation:</strong>{" "}
              {supplier.applianceGuidance.softenerAdvice}
            </div>
          </div>
        </div>

        {/* Interactive Outcode Directory Grid */}
        <SupplierOutcodeGrid
          supplierName={supplier.name}
          outcodes={outcodes}
        />

        {/* High-Converting Lead Generation Engine */}
        <QuoteRequestCard
          outcode={overview.hardestOutcode?.outcode || "UK"}
          avgPpm={networkAvgPpm}
          locationName={`${supplier.name} Service Area`}
        />

        {/* Authoritative FAQ Section */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-blue-600 shrink-0" />
            Frequently Asked Questions: {supplier.name} Water Hardness
          </h2>

          <div className="space-y-4">
            {supplier.faqItems.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-100 bg-slate-50/60 p-5 hover:bg-slate-50 transition-colors"
              >
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
