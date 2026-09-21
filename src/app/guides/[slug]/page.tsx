import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guidesData, getGuideBySlug } from "@/lib/guidesData";
import QuoteRequestCard from "@/components/lead/QuoteRequestCard";
import { 
  Home, 
  ChevronRight, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  UserCircle, 
  Droplet, 
  WashingMachine, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  MapPin,
  Flame,
  Award,
  ExternalLink,
  ChevronDown
} from "lucide-react";

export const revalidate = 86400; // ISR Cache 24h
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guidesData.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: "Guide Not Found - WaterHardness.uk",
    };
  }

  const canonicalUrl = `https://waterhardness.uk/guides/${guide.slug}`;

  // Giữ Title tuyệt đối dưới 58 ký tự và description dưới 155 ký tự
  const titleWithSuffix = `${guide.metaTitle} | WaterHardness.uk`;
  const absoluteTitle = titleWithSuffix.length <= 58 
    ? titleWithSuffix 
    : `${guide.metaTitle.slice(0, 36)}... | WaterHardness.uk`;

  const metaDesc = guide.metaDescription.length <= 155 
    ? guide.metaDescription 
    : `${guide.metaDescription.slice(0, 151)}...`;

  return {
    title: { absolute: absoluteTitle },
    description: metaDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: canonicalUrl,
      siteName: "WaterHardness.uk",
      locale: "en_GB",
      type: "article",
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
      authors: ["Nguyen Hac Phong"],
    },
  };
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const formatDateUI = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  // Calculate representative water hardness PPM for quote engine
  let guidePpm = 240;
  if (guide.quickVerdict.ppmRange) {
    const match = guide.quickVerdict.ppmRange.match(/\d+/g);
    if (match && match.length > 0) {
      const nums = match.map(Number);
      guidePpm = Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
    }
  } else if (guide.quickVerdict.classification?.toLowerCase().includes("soft")) {
    guidePpm = 60;
  }

  // Schema.org JSON-LD (Article, BreadcrumbList, FAQPage)
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://waterhardness.uk/guides/${guide.slug}#article`,
        "headline": guide.title,
        "description": guide.metaDescription,
        "datePublished": guide.datePublished,
        "dateModified": guide.dateModified,
        "mainEntityOfPage": `https://waterhardness.uk/guides/${guide.slug}`,
        "author": {
          "@type": "Person",
          "@id": "https://waterhardness.uk/#person",
          "name": "Nguyen Hac Phong",
          "jobTitle": "Lead Water Engineer",
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
        "about": {
          "@type": "Thing",
          "name": guide.targetKeyword
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
            "name": "Guides",
            "item": "https://waterhardness.uk/guides"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": guide.title,
            "item": `https://waterhardness.uk/guides/${guide.slug}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": guide.faqItems.map((faq) => ({
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
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ARTICLE HEADER HERO */}
      <section className="bg-slate-900 text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/guides" className="hover:text-white transition-colors">
              Guides
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-cyan-400 font-medium truncate max-w-xs sm:max-w-sm">
              {guide.title}
            </span>
          </nav>

          {/* Category & Reading time */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Droplet className="w-3.5 h-3.5" /> {guide.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" /> {guide.readingTime}
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" /> Updated {formatDateUI(guide.dateModified)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            {guide.title}
          </h1>

          {/* Lead Description */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            {guide.metaDescription}
          </p>

          {/* E-E-A-T Author Card Mini */}
          <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 border-2 border-slate-700">
              NP
            </div>
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                Nguyen Hac Phong
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </p>
              <p className="text-xs text-slate-400">Lead Water Engineer • WaterHardness.uk Technical Desk</p>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE BODY & SIDEBAR CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* QUICK VERDICT BOX */}
        <div className="bg-white rounded-3xl border-2 border-cyan-600/30 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-cyan-800 font-bold text-base">
              <Award className="w-5 h-5 text-cyan-600" />
              <span>Quick Technical Verdict</span>
            </div>
            {guide.quickVerdict.classification && (
              <span className="bg-cyan-50 border border-cyan-200 text-cyan-800 font-bold px-3 py-1 rounded-full text-xs">
                {guide.quickVerdict.classification}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {guide.quickVerdict.ppmRange && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-semibold block mb-1 uppercase tracking-wider text-[10px]">
                  Mineral Density (PPM)
                </span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {guide.quickVerdict.ppmRange}
                </span>
              </div>
            )}
            {guide.quickVerdict.supplier && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-semibold block mb-1 uppercase tracking-wider text-[10px]">
                  Water Authority / Scope
                </span>
                <span className="text-base font-bold text-slate-900">
                  {guide.quickVerdict.supplier}
                </span>
              </div>
            )}
          </div>

          <div className="bg-cyan-50/70 border border-cyan-100 rounded-2xl p-4 text-sm text-slate-800 leading-relaxed">
            <strong className="text-cyan-950 font-bold block mb-1">Key Takeaway:</strong>
            {guide.quickVerdict.keyTakeaway}
          </div>
        </div>

        {/* E-E-A-T AUTHOR BOX (FULL CREDENTIALS) */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0 border-2 border-slate-700 shadow-sm">
              NP
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Nguyen Hac Phong
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  </h3>
                  <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                    Lead Water Quality & Plumbing Data Engineer
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <a
                    href="https://github.com/KoVN-s"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                  <span>•</span>
                  <a
                    href="https://www.linkedin.com/in/nguy%E1%BB%85n-phong-a673681b5/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    LinkedIn <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Nguyen Hac Phong specializes in hydrological geospatial modeling and programmatic UK environmental analytics. His engineering analyses cross-examine public Drinking Water Inspectorate (DWI) compliance records, water supply zone (WSZ) water chemistry disclosures, and British Standards (BS 7593 / Part L) to deliver verified, zero-fluff consumer guidance.
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT BODY */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
          <div 
            className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700"
            dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
          />
        </div>

        {/* APPLIANCE SPECS / SETTINGS CALLOUT BOX */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-600/30 rounded-xl flex items-center justify-center text-cyan-400">
              <WashingMachine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Appliance Setup & Descaling Specifications</h3>
              <p className="text-xs text-slate-400">Official calibration guidelines for domestic appliances in this hardness band</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
              <span className="text-cyan-400 font-bold block text-sm">Bosch / Neff / Siemens</span>
              <p className="text-slate-300">
                {guide.quickVerdict.classification?.includes("Soft")
                  ? "Dial setting H00 or H01. Salt tank can remain uncharged."
                  : guide.quickVerdict.classification?.includes("Very Hard")
                  ? "Dial setting H05 to H07. Keep salt reservoir fully topped up."
                  : "Dial setting H03 to H04. Regular salt replenishment required."}
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
              <span className="text-cyan-400 font-bold block text-sm">Beko / Blomberg</span>
              <p className="text-slate-300">
                {guide.quickVerdict.classification?.includes("Soft")
                  ? "Level 1. Water softener electronically bypassed."
                  : guide.quickVerdict.classification?.includes("Very Hard")
                  ? "Level 4 or Level 5 (Maximum regeneration cycle)."
                  : "Level 2 or Level 3 for balanced softening."}
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
              <span className="text-cyan-400 font-bold block text-sm">Combi Boiler & Cylinder</span>
              <p className="text-slate-300">
                {guide.quickVerdict.classification?.includes("Soft")
                  ? "No scale risk on plate heat exchanger; dose BS 7593 inhibitor."
                  : "Fit inline electrolytic inhibitor (Part L) or ion-exchange softener."}
              </p>
            </div>
          </div>
        </div>

        {/* LOCAL LEAD CAPTURE ENGINE: WATER SOFTENER & HEATING PROTECTION */}
        {guide.relatedOutcodes && guide.relatedOutcodes.length > 0 && (
          <QuoteRequestCard
            outcode={guide.relatedOutcodes[0]}
            avgPpm={guidePpm}
            locationName={guide.relatedOutcodes[0]}
          />
        )}

        {/* FAQ ACCORDION SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h3>
              <p className="text-xs text-slate-500">Engineer-verified answers to common search queries</p>
            </div>
          </div>

          <div className="space-y-4">
            {guide.faqItems.map((faq, index) => (
              <details
                key={index}
                className="group border border-slate-200 rounded-2xl p-4 sm:p-5 transition-colors open:bg-slate-50 open:border-cyan-200"
              >
                <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between gap-4 text-sm sm:text-base select-none list-none">
                  <span>{faq.question}</span>
                  <span className="w-6 h-6 rounded-full bg-slate-100 group-open:bg-cyan-600 group-open:text-white flex items-center justify-center shrink-0 text-slate-600 transition-transform group-open:rotate-180 text-xs">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* RELATED OUTCODES (INTERNAL LINKING FOR PROGRAMMATIC SEO) */}
        {guide.relatedOutcodes && guide.relatedOutcodes.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
              <MapPin className="w-5 h-5 text-cyan-600" />
              <span>Related UK Postal Districts & Water Reports</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Check hyper-local water hardness metrics, sector-by-sector variance, and postcode street tables for areas discussed in this guide:
            </p>
            <div className="flex items-center gap-2.5 flex-wrap pt-2">
              {guide.relatedOutcodes.map((outcode) => (
                <Link
                  key={outcode}
                  href={`/water-hardness/${outcode.toLowerCase()}`}
                  className="bg-slate-50 hover:bg-cyan-600 hover:text-white border border-slate-200 hover:border-cyan-600 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-2xs flex items-center gap-1.5"
                >
                  <span>Outcode {outcode}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* BACK TO HUB LINK */}
        <div className="text-center pt-4">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-900 transition-colors"
          >
            ← Back to All Guides & Blog
          </Link>
        </div>

      </main>
    </div>
  );
}
