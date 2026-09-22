import { Metadata } from "next";
import Link from "next/link";
import { 
  Scale, 
  ArrowRight, 
  Droplets, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  MapPin,
  WashingMachine,
  CheckCircle2,
  Info
} from "lucide-react";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Compare UK Water Hardness: Postcode & City Head-to-Head",
  description: "Compare tap water hardness between UK cities and postcodes. Check PPM differences, boiler scale risks, kettle maintenance, and dishwasher settings.",
  alternates: {
    canonical: "https://waterhardness.uk/compare",
  },
  openGraph: {
    title: "Compare UK Water Hardness: Postcode & City Head-to-Head",
    description: "Compare tap water hardness between UK cities and postcodes. Check PPM differences, boiler scale risks, and appliance settings.",
    url: "https://waterhardness.uk/compare",
    siteName: "WaterHardness.uk",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare UK Water Hardness: Postcode & City Head-to-Head",
    description: "Compare tap water hardness between UK cities and postcodes. Check PPM differences, boiler scale risks, and appliance settings.",
  },
};

interface ComparisonPair {
  slug: string;
  badge: string;
  locationA: {
    name: string;
    sector: string;
    ppm: number;
    category: string;
    supplier: string;
  };
  locationB: {
    name: string;
    sector: string;
    ppm: number;
    category: string;
    supplier: string;
  };
  highlight: string;
}

const comparisonPairs: ComparisonPair[] = [
  {
    slug: "sw1a-1-vs-m1-1",
    badge: "North vs South",
    locationA: {
      name: "London (Westminster)",
      sector: "SW1A 1",
      ppm: 280,
      category: "Hard Water",
      supplier: "Thames Water",
    },
    locationB: {
      name: "Manchester (City Centre)",
      sector: "M1 1",
      ppm: 35,
      category: "Soft Water",
      supplier: "United Utilities",
    },
    highlight: "London tap water is 8x harder than Manchester. London combi boilers require BS 7593 scale inhibitors, while Manchester homes require zero dishwasher salt.",
  },
  {
    slug: "sw1a-1-vs-b1-1",
    badge: "Capital vs Midlands",
    locationA: {
      name: "London (Westminster)",
      sector: "SW1A 1",
      ppm: 280,
      category: "Hard Water",
      supplier: "Thames Water",
    },
    locationB: {
      name: "Birmingham (City Centre)",
      sector: "B1 1",
      ppm: 48,
      category: "Soft Water",
      supplier: "Severn Trent Water",
    },
    highlight: "Birmingham receives naturally soft Welsh mountain water via the 73-mile Elan Valley Aqueduct, whereas London draws from calcium-rich chalk aquifers.",
  },
  {
    slug: "sw1a-1-vs-eh1-1",
    badge: "England vs Scotland",
    locationA: {
      name: "London (Westminster)",
      sector: "SW1A 1",
      ppm: 280,
      category: "Hard Water",
      supplier: "Thames Water",
    },
    locationB: {
      name: "Edinburgh (Old Town)",
      sector: "EH1 1",
      ppm: 45,
      category: "Soft Water",
      supplier: "Scottish Water",
    },
    highlight: "Moving from London to Edinburgh completely stops kettle furring. Black tea infuses clear without the oily calcium film typical of London tap water.",
  },
  {
    slug: "b1-1-vs-m1-1",
    badge: "Soft Water Showdown",
    locationA: {
      name: "Birmingham (City Centre)",
      sector: "B1 1",
      ppm: 48,
      category: "Soft Water",
      supplier: "Severn Trent Water",
    },
    locationB: {
      name: "Manchester (City Centre)",
      sector: "M1 1",
      ppm: 35,
      category: "Soft Water",
      supplier: "United Utilities",
    },
    highlight: "Both cities enjoy ultra-soft tap water from upland granite and moorland catchments (Elan Valley vs Lake District). Both can safely bypass dishwasher salt.",
  },
  {
    slug: "ab10-1-vs-sw1a-1",
    badge: "Extreme Hydro-Contrast",
    locationA: {
      name: "Aberdeen (Granite City)",
      sector: "AB10 1",
      ppm: 25,
      category: "Naturally Soft",
      supplier: "Scottish Water",
    },
    locationB: {
      name: "London (Westminster)",
      sector: "SW1A 1",
      ppm: 280,
      category: "Hard Water",
      supplier: "Thames Water",
    },
    highlight: "One of the sharpest water contrasts in the UK: Aberdeen's River Dee granite catchment (25 PPM) vs London's Cretaceous chalk aquifer (280 PPM).",
  },
  {
    slug: "ls1-1-vs-sw1a-1",
    badge: "Yorkshire vs London",
    locationA: {
      name: "Leeds (City Centre)",
      sector: "LS1 1",
      ppm: 120,
      category: "Moderate Water",
      supplier: "Yorkshire Water",
    },
    locationB: {
      name: "London (Westminster)",
      sector: "SW1A 1",
      ppm: 280,
      category: "Hard Water",
      supplier: "Thames Water",
    },
    highlight: "Leeds tap water averages half the mineral load of London. Traditional Yorkshire Tea was blended specifically for soft-to-moderate waters like Leeds.",
  },
  {
    slug: "bs1-1-vs-m1-1",
    badge: "West Country vs North West",
    locationA: {
      name: "Bristol (City Centre)",
      sector: "BS1 1",
      ppm: 260,
      category: "Very Hard",
      supplier: "Bristol Water",
    },
    locationB: {
      name: "Manchester (City Centre)",
      sector: "M1 1",
      ppm: 35,
      category: "Soft Water",
      supplier: "United Utilities",
    },
    highlight: "Bristol's Mendip limestone creates rapid chalk furring on kettle bases and shower cartridges, while Manchester plumbing remains virtually scale-free.",
  },
];

export default function CompareHubPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://waterhardness.uk/compare",
        "url": "https://waterhardness.uk/compare",
        "name": "Compare UK Water Hardness Head-to-Head",
        "description": "Compare municipal tap water hardness ratings, PPM levels, and boiler protection guidance between UK cities and postcode districts.",
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
              "name": "Compare Water Hardness",
              "item": "https://waterhardness.uk/compare"
            }
          ]
        },
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": comparisonPairs.map((pair, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": `${pair.locationA.name} vs ${pair.locationB.name} Water Hardness`,
            "url": `https://waterhardness.uk/compare/${pair.slug}`
          }))
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
        {/* Header Breadcrumbs */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-cyan-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <span className="font-semibold text-slate-700">Compare Water Hardness</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 mb-4">
              <Scale className="h-3.5 w-3.5" />
              <span>UK Head-to-Head Water Quality Comparator</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Compare UK Water Hardness Head-to-Head
            </h1>

            <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Moving home or wondering why your appliances scale up differently across Britain? Compare tap water mineral density (PPM), limescale accumulation speed, boiler heat exchanger drag, and dishwasher salt calibrations between UK postcode sectors.
            </p>

            {/* Quick KPI Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">PPM Mineral Contrast</span>
                  <span className="text-sm font-bold text-slate-800 block">25 PPM to 360+ PPM</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Boiler Fuel Penalty</span>
                  <span className="text-sm font-bold text-slate-800 block">Up to 12% scale loss in Hard zones</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Verified DWI Data</span>
                  <span className="text-sm font-bold text-slate-800 block">Official UK water company metrics</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Popular UK Head-to-Head Comparisons
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Side-by-side analysis of Britain&apos;s most compared postal districts and metropolitan areas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparisonPairs.map((pair) => (
              <div
                key={pair.slug}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {pair.badge}
                    </span>
                    <span className="text-xs text-slate-400">PPM Head-to-Head</span>
                  </div>

                  {/* Versus Header */}
                  <div className="grid grid-cols-2 gap-3 mb-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 block truncate">
                        {pair.locationA.name}
                      </span>
                      <span className="text-lg font-black text-slate-900 block mt-0.5">
                        {pair.locationA.ppm} <span className="text-xs font-semibold text-slate-500">PPM</span>
                      </span>
                      <span className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        pair.locationA.ppm >= 200 ? "bg-rose-100 text-rose-800" :
                        pair.locationA.ppm >= 100 ? "bg-amber-100 text-amber-800" :
                        "bg-emerald-100 text-emerald-800"
                      }`}>
                        {pair.locationA.category}
                      </span>
                    </div>

                    <div className="border-l border-slate-200 pl-3">
                      <span className="text-xs font-semibold text-slate-500 block truncate">
                        {pair.locationB.name}
                      </span>
                      <span className="text-lg font-black text-slate-900 block mt-0.5">
                        {pair.locationB.ppm} <span className="text-xs font-semibold text-slate-500">PPM</span>
                      </span>
                      <span className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        pair.locationB.ppm >= 200 ? "bg-rose-100 text-rose-800" :
                        pair.locationB.ppm >= 100 ? "bg-amber-100 text-amber-800" :
                        "bg-emerald-100 text-emerald-800"
                      }`}>
                        {pair.locationB.category}
                      </span>
                    </div>
                  </div>

                  {/* Summary Highlight */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-5">
                    {pair.highlight}
                  </p>
                </div>

                {/* Card Action Link */}
                <Link
                  href={`/compare/${pair.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-cyan-600 text-white transition-colors group"
                >
                  <span>View Detailed Versus Report ({pair.locationA.sector} vs {pair.locationB.sector})</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>

          {/* Educational Guidance Section */}
          <div className="mt-12 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Why Compare Tap Water Hardness When Moving?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Three critical household adjustments when transitioning between UK water zones
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <WashingMachine className="w-4 h-4 text-cyan-600" />
                  <span>Dishwasher Salt Settings</span>
                </div>
                <p className="leading-relaxed">
                  Moving from a soft area (Manchester, Birmingham) to a hard area (London, Surrey, Bristol) requires resetting your dishwasher from H00 to H05. Running without salt in hard water permanently etches glassware within weeks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Combi Boiler Protection (BS 7593)</span>
                </div>
                <p className="leading-relaxed">
                  Building Regulations Part L and British Standard BS 7593 mandate permanent inline scale protection for combi boilers in areas above 200 PPM. A 1.5mm limescale crust reduces heating heat transfer by up to 12%.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span>Skin & Eczema Sensitivity</span>
                </div>
                <p className="leading-relaxed">
                  High calcium water bonds with bath soaps, forming an insoluble curd that strips natural skin barrier lipids. Households moving south frequently notice increased skin dryness and childhood eczema flare-ups.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600">
            <span>Explore other directories:</span>
            <Link href="/cities" className="text-cyan-600 hover:underline">
              UK Cities Directory →
            </Link>
            <span>•</span>
            <Link href="/outcodes" className="text-cyan-600 hover:underline">
              All 3,000 Outcodes →
            </Link>
            <span>•</span>
            <Link href="/guides" className="text-cyan-600 hover:underline">
              Water Science & Appliance Guides →
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}