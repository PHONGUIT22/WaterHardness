import { Metadata } from "next";
import Link from "next/link";
import { guidesData } from "@/lib/guidesData";
import GuidesClient from "./GuidesClient";
import { 
  ShieldCheck, 
  BookOpen, 
  ChevronRight, 
  Home, 
  UserCircle, 
  Award, 
  CheckCircle2, 
  Droplet 
} from "lucide-react";

export const revalidate = 86400; // Cache 24h on CDN

export const metadata: Metadata = {
  title: "UK Water Hardness & Appliance Guides",
  description: "Expert UK guides on water hardness (PPM), limescale removal, dishwasher salt settings, combi boiler efficiency & local water supplier catchment reports.",
  alternates: {
    canonical: "https://waterhardness.uk/guides",
  },
  openGraph: {
    title: "UK Water Hardness & Appliance Guides",
    description: "Expert British guides on UK water hardness, boiler scale protection, dishwasher calibration, and regional water supply science.",
    url: "https://waterhardness.uk/guides",
    siteName: "WaterHardness.uk",
    locale: "en_GB",
    type: "website",
  },
};

export default function GuidesHubPage() {
  const allGuides = guidesData;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://waterhardness.uk/guides",
        "url": "https://waterhardness.uk/guides",
        "name": "UK Water Hardness & Appliance Guides Hub",
        "description": "Comprehensive editorial library of UK water hardness diagnostics, appliance calibration tables, and regional hydrogeological analyses.",
        "publisher": {
          "@type": "Organization",
          "name": "WaterHardness.uk",
          "logo": {
            "@type": "ImageObject",
            "url": "https://waterhardness.uk/logo.png"
          }
        }
      },
      {
        "@type": "ItemList",
        "itemListElement": allGuides.map((guide, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "url": `https://waterhardness.uk/guides/${guide.slug}`,
          "name": guide.title
        }))
      },
      {
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
            "name": "Guides & Blog",
            "item": "https://waterhardness.uk/guides"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* HERO SECTION */}
      <section className="bg-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-semibold text-cyan-400">Guides & Technical Hub</span>
          </nav>

          {/* Badge & Title */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-800/80 px-3.5 py-1 rounded-full text-xs font-bold text-cyan-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> E-E-A-T Verified Water Engineering Library
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Water Hardness & Appliance <span className="text-cyan-400">Guides</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              In-depth technical guides, regional catchment reports, and appliance calibration manuals written by British water quality specialists. Verified against Drinking Water Inspectorate (DWI) disclosures and UK Building Regulations Part L.
            </p>
          </div>

          {/* Author Badge */}
          <div className="pt-2 flex items-center gap-4 text-xs text-slate-300 border-t border-slate-800/80 max-w-xl">
            <div className="w-9 h-9 bg-cyan-600 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0">
              NP
            </div>
            <div>
              <p className="font-bold text-white">Curated by Nguyen Hac Phong</p>
              <p className="text-slate-400 text-[11px]">Lead Water Quality & Data Engineer • Updated for 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA WITH CLIENT FILTER & CARDS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <GuidesClient initialGuides={allGuides} />
      </main>
    </div>
  );
}
