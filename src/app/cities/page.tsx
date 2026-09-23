import { Metadata } from "next";
import Link from "next/link";
import { citiesData } from "@/lib/citiesData";
import CitiesDirectoryClient from "./CitiesDirectoryClient";
import { ChevronRight, Droplets, MapPin, ShieldCheck, Scale, Compass } from "lucide-react";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "UK Water Hardness by City: Complete PPM Directory",
  description: "Compare tap water hardness ratings across 30 major UK cities. Check PPM levels, water suppliers, and local limescale risks for your hometown.",
  alternates: {
    canonical: "https://waterhardness.uk/cities",
  },
  openGraph: {
    title: "UK Water Hardness by City: Complete PPM Directory",
    description: "Compare tap water hardness ratings across 30 major UK cities. Check PPM levels, water suppliers, and local limescale risks for your hometown.",
    url: "https://waterhardness.uk/cities",
    siteName: "WaterHardness.uk",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Water Hardness by City: Complete PPM Directory",
    description: "Compare tap water hardness ratings across 30 major UK cities. Check PPM levels, water suppliers, and local limescale risks for your hometown.",
  },
};

export default function CitiesDirectoryPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://waterhardness.uk/cities",
        "url": "https://waterhardness.uk/cities",
        "name": "UK Water Hardness by City: Complete PPM Directory",
        "description": "Comprehensive comparative directory of municipal tap water hardness across 30 primary UK cities.",
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
            }
          ]
        },
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": citiesData.map((city, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": `${city.name} Water Hardness (${city.avgPpm} PPM)`,
            "url": `https://waterhardness.uk/cities/${city.slug}`
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

      <div className="min-h-screen bg-slate-50 pb-16">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900">UK Cities Directory</span>
            </nav>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                <Compass className="h-3.5 w-3.5" />
                National Hydro-Index
              </span>
              <span className="text-xs text-slate-500">
                30 UK Metropolitan Hubs
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              UK Water Hardness by City: Complete PPM Directory
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-3xl">
              Compare average mineral PPM levels, water suppliers, and neighbourhood hydro-variance across the UK&apos;s 30 largest cities. Select any city to view local outcode postcodes and Which?-style household advice.
            </p>
          </div>

          {/* Key Facts Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-bold uppercase text-slate-500 mb-1 flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-emerald-600" /> Softest Major City
              </div>
              <div className="text-2xl font-black text-slate-900">Glasgow (22 PPM)</div>
              <div className="text-xs text-slate-500 mt-1">Sourced from Loch Katrine (Scottish Water)</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-bold uppercase text-slate-500 mb-1 flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-rose-600" /> Hardest Major City
              </div>
              <div className="text-2xl font-black text-slate-900">Norwich (325 PPM)</div>
              <div className="text-xs text-slate-500 mt-1">Deep Norfolk chalk boreholes (Anglian Water)</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-bold uppercase text-slate-500 mb-1 flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-blue-600" /> UK Baseline Benchmark
              </div>
              <div className="text-2xl font-black text-slate-900">~200 PPM CaCO3</div>
              <div className="text-xs text-slate-500 mt-1">Threshold between moderate and hard water</div>
            </div>
          </div>

          {/* Interactive Client Directory Component */}
          <CitiesDirectoryClient cities={citiesData} />
        </main>
      </div>
    </>
  );
}
