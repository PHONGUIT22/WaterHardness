import { Metadata } from "next";
import Link from "next/link";
import { getAllSuppliers } from "@/lib/suppliersData";
import {
  ChevronRight,
  Droplets,
  Building2,
  ShieldCheck,
  ArrowRight,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "UK Water Suppliers Hardness: Official DWI Directory",
  description: "Check tap water hardness by water company across all 12 major UK water utilities. Official DWI PPM ratings, chalk aquifer vs reservoir data & bill lookup.",
  alternates: {
    canonical: "https://waterhardness.uk/suppliers",
  },
  openGraph: {
    title: "UK Water Suppliers Hardness: Official DWI Directory",
    description: "Check tap water hardness by water company across all 12 major UK water utilities. Official DWI PPM ratings, chalk aquifer vs reservoir data & bill lookup.",
    url: "https://waterhardness.uk/suppliers",
    siteName: "WaterHardness.uk",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Water Suppliers Hardness: Official DWI Directory",
    description: "Check tap water hardness by water company across all 12 major UK water utilities. Official DWI PPM ratings, chalk aquifer vs reservoir data & bill lookup.",
  },
};

export default function SuppliersDirectoryPage() {
  const suppliers = getAllSuppliers();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://waterhardness.uk/suppliers",
        "url": "https://waterhardness.uk/suppliers",
        "name": "UK Water Suppliers Hardness: Official DWI Directory",
        "description": "Comprehensive comparative directory of water hardness across the 12 primary UK water supply authorities.",
        "breadcrumb": {
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
          ],
        },
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": suppliers.map((sup, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": `${sup.name} Water Hardness (${sup.typicalPpmRange})`,
            "url": `https://waterhardness.uk/suppliers/${sup.slug}`,
          })),
        },
      },
    ],
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case "Soft Water":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Moderately Soft":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "Moderately Hard":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Hard Water":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-rose-100 text-rose-800 border-rose-200";
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-slate-50/50 pb-16">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900">UK Water Suppliers</span>
            </nav>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
          {/* Header Section */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                <Building2 className="h-3.5 w-3.5" />
                Water Authority Index
              </span>
              <span className="text-xs text-slate-500">
                12 Licensed UK Water Utilities
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              UK Water Hardness by Supplier
            </h1>
            <p className="mt-2 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Find your water company from your recent water bill to explore verified Drinking Water Inspectorate (DWI) PPM ratings, groundwater catchment origins, and local limescale prevention protocols.
            </p>
          </div>

          {/* Supplier Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {suppliers.map((supplier) => (
              <Link
                key={supplier.slug}
                href={`/suppliers/${supplier.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all duration-150"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {supplier.name}
                      </h2>
                      <span className="text-xs text-slate-500 mt-0.5 block">
                        {supplier.region}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border shrink-0 ${getBadgeColor(
                        supplier.hardnessCategory
                      )}`}
                    >
                      {supplier.hardnessCategory}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {supplier.quickAnswer.summary}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Typical Range:</span>
                      <span className="font-semibold text-slate-800">{supplier.typicalPpmRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Source:</span>
                      <span className="font-semibold text-slate-800 capitalize">
                        {supplier.waterSourceType.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Key Cities:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                        {supplier.majorCities.slice(0, 3).join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  <span>View Full PPM Ratings &amp; Outcode Map</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>

          {/* Geological Primer Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="h-6 w-6 text-blue-600" />
              How Does Your Water Supplier Affect Water Hardness?
            </h2>
            <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                In the United Kingdom, drinking water suppliers do not artificially alter or soften municipal tap water at treatment works. Doing so across billions of litres daily would be economically prohibitive and would remove healthy dietary minerals (calcium and magnesium) required by public health standards.
              </p>
              <p>
                As a result, your tap water&apos;s hardness is entirely determined by where your water company abstracts its raw supply:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li><strong>Underground Chalk Aquifers (e.g. Anglian Water, Affinity Water, Southern Water):</strong> Rain sinks through porous Cretaceous chalk beds, absorbing extreme calcium concentrations resulting in 280–360+ PPM water.</li>
                <li><strong>Granite &amp; Volcanic Moorlands (e.g. Scottish Water, United Utilities, Welsh Water):</strong> Rain collects on ancient, impermeable igneous rock, delivering ultra-pure soft water (15–50 PPM) with zero limescale.</li>
                <li><strong>Blended Lowland River Catchments (e.g. Thames Water, Severn Trent):</strong> Combines spring-fed river abstraction with subterranean well blending.</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
