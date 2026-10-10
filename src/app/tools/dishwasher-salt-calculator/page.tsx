import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  WashingMachine,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Home,
  CheckCircle2,
  Droplet,
  Scale
} from "lucide-react";
import DishwasherCalculatorClient from "./DishwasherCalculatorClient";

export const revalidate = 86400; // Cache 24 hours

export const metadata: Metadata = {
  title: "UK Dishwasher Salt Setting Calculator by Postcode | WaterHardness.uk",
  description:
    "Look up exact dishwasher water hardness dial settings and salt consumption for Bosch, Beko, Miele, Samsung & Indesit across all UK postcodes.",
  alternates: {
    canonical: "https://waterhardness.uk/tools/dishwasher-salt-calculator"
  },
  openGraph: {
    title: "UK Dishwasher Salt Setting Calculator by Postcode",
    description:
      "Calibrate your Bosch, Beko, Miele, Samsung or Indesit dishwasher based on official DWI water hardness PPM ratings across all UK postcodes.",
    url: "https://waterhardness.uk/tools/dishwasher-salt-calculator",
    type: "website"
  }
};

interface PageProps {
  searchParams: Promise<{ outcode?: string; brand?: string; ppm?: string }>;
}

export default async function DishwasherSaltCalculatorPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const initialOutcode = (resolvedParams.outcode || "").toUpperCase().trim();
  const initialBrand = (resolvedParams.brand || "bosch").toLowerCase().trim();
  const initialPpm = Number(resolvedParams.ppm) || (initialOutcode ? 280 : 275);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://waterhardness.uk/tools/dishwasher-salt-calculator#app",
        "url": "https://waterhardness.uk/tools/dishwasher-salt-calculator",
        "name": "UK Dishwasher Salt Setting Calculator by Postcode",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript",
        "description":
          "Calculate exact water hardness dial settings and monthly salt consumption for Bosch, Beko, Miele, Samsung, Siemens, Neff, and Indesit dishwashers across all UK postcodes.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "GBP"
        }
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
            "name": "Tools",
            "item": "https://waterhardness.uk/tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Dishwasher Salt Calculator",
            "item": "https://waterhardness.uk/tools/dishwasher-salt-calculator"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://waterhardness.uk/tools/dishwasher-salt-calculator#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can I just use All-in-One dishwasher tablets instead of dishwasher salt?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In soft water regions (<100 PPM), all-in-one tablets may suffice. However, in hard water regions (>200 PPM), all-in-one tablets are insufficient because they only dissolve during the wash cycle. The final hot rinse uses raw mains tap water, leaving cloudy limescale crust on glasses unless your internal ion-exchange salt chamber is active."
            }
          },
          {
            "@type": "Question",
            "name": "Can I use standard cooking salt or table salt in my dishwasher?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Never use table salt, cooking salt, rock salt, or sea salt in a dishwasher. Food-grade salts contain fine grains and anti-caking additives that clog and chemically degrade the delicate synthetic ion-exchange resin bed."
            }
          },
          {
            "@type": "Question",
            "name": "What should I do if I have a whole-house water softener installed?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "If your kitchen cold supply feeds through an approved ion-exchange water softener, your water is already softened to <20 PPM. Set your dishwasher hardness dial to the lowest setting (e.g. H:00 on Bosch, Level 1 on Beko, or 1–4°dH on Miele)."
            }
          },
          {
            "@type": "Question",
            "name": "How often should I refill the dishwasher salt reservoir in the UK?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In a moderate water area (100–200 PPM), a 1.5kg salt reservoir typically lasts 6 to 8 weeks with daily cycles. In hard or very hard water areas (250–350+ PPM), the reservoir may require refilling every 3 to 4 weeks."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* HERO SECTION */}
      <section className="bg-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto space-y-5">
          {/* Breadcrumb Bar */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-400 flex-wrap">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-400">Tools</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-semibold text-cyan-400">Dishwasher Salt Calculator</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Micro-Tool
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> BS 7593 &amp; DWI Aligned
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            UK Dishwasher Salt Setting <span className="text-cyan-400">Calculator</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Enter your UK postcode to find the exact water hardness dial settings and monthly salt consumption for <strong>Bosch, Beko, Miele, Samsung, Neff, Siemens &amp; Indesit</strong> dishwashers. Prevent cloudy glasses, white mineral film, and premature heating element burnout.
          </p>
        </div>
      </section>

      {/* MAIN CALCULATOR CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <Suspense
          fallback={
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
              <WashingMachine className="w-8 h-8 animate-pulse text-cyan-600 mx-auto mb-3" />
              <p className="text-sm font-semibold">Loading Dishwasher Salt Calculator...</p>
            </div>
          }
        >
          <DishwasherCalculatorClient
            initialOutcode={initialOutcode}
            initialBrand={initialBrand}
            initialPpm={initialPpm}
          />
        </Suspense>

        {/* REGIONAL EXPLORATION FOOTER LINKS */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-100/70 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center font-bold shrink-0">
              DW
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">
                Explore Regional Water Quality &amp; Appliance Data
              </span>
              <span className="text-slate-500 block mt-0.5">
                Check official DWI testing figures, combi boiler scaling estimates, and regional outcode tables.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <Link
              href="/cities"
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-cyan-400 font-bold text-slate-700 transition-all shadow-2xs"
            >
              UK Cities
            </Link>
            <Link
              href="/suppliers"
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-cyan-400 font-bold text-slate-700 transition-all shadow-2xs"
            >
              Water Suppliers
            </Link>
            <Link
              href="/compare"
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition-all shadow-2xs"
            >
              Compare Areas
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
