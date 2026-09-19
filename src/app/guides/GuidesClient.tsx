"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GuideArticle } from "@/lib/guidesData";
import { 
  Search, 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowRight, 
  MapPin, 
  Droplet,
  CheckCircle2,
  Sparkles,
  Layers
} from "lucide-react";

interface Props {
  initialGuides: GuideArticle[];
}

const CATEGORIES = [
  "All Guides",
  "Regional Hardness",
  "Appliance Care",
  "Plumbing & Heating",
  "Health & Water Science",
] as const;

export default function GuidesClient({ initialGuides }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Guides");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = useMemo(() => {
    return initialGuides.filter((guide) => {
      const matchesCategory =
        selectedCategory === "All Guides" || guide.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        guide.title.toLowerCase().includes(query) ||
        guide.metaDescription.toLowerCase().includes(query) ||
        guide.targetKeyword.toLowerCase().includes(query) ||
        (guide.relatedOutcodes &&
          guide.relatedOutcodes.some((outcode) =>
            outcode.toLowerCase().includes(query)
          ));

      return matchesCategory && matchesSearch;
    });
  }, [initialGuides, selectedCategory, searchQuery]);

  const getCategoryBadgeClass = (category: GuideArticle["category"]) => {
    switch (category) {
      case "Regional Hardness":
        return "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100";
      case "Appliance Care":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
      case "Plumbing & Heating":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
      case "Health & Water Science":
        return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
    }
  };

  const formatDateUI = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8">
      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, cities (e.g. Bristol, London), appliances, or outcodes..."
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-cyan-600 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full px-2 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs font-semibold text-slate-500 shrink-0 self-center">
            Showing <span className="text-slate-900 font-bold">{filteredGuides.length}</span> of {initialGuides.length} articles
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Layers className="w-4 h-4 text-slate-400 shrink-0 ml-1 hidden sm:inline" />
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ARTICLE GRID */}
      {filteredGuides.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No guides found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            We couldn't find any articles matching &quot;{searchQuery}&quot;. Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All Guides");
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-4 py-2 rounded-full hover:bg-cyan-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <article
              key={guide.slug}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                {/* Meta header: Category Badge & Reading Time */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getCategoryBadgeClass(
                      guide.category
                    )}`}
                  >
                    <Droplet className="w-3 h-3 shrink-0" />
                    {guide.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {guide.readingTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors leading-snug">
                  <Link href={`/guides/${guide.slug}`}>
                    {guide.title}
                  </Link>
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {guide.metaDescription}
                </p>

                {/* Quick Verdict Box preview */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500">Quick Verdict</span>
                    {guide.quickVerdict.ppmRange && (
                      <span className="font-mono text-cyan-800 bg-cyan-100/60 px-2 py-0.5 rounded text-[11px]">
                        {guide.quickVerdict.ppmRange}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed">
                    {guide.quickVerdict.keyTakeaway}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Updated {formatDateUI(guide.dateModified)}</span>
                </div>

                <Link
                  href={`/guides/${guide.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700 group-hover:text-cyan-900 transition-colors"
                >
                  Read Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
