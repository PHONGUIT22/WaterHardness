"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { resolveSearchDestination } from "@/lib/search";

export default function HeroSearchSection() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;
    setIsSearching(true);
    try {
      const targetUrl = await resolveSearchDestination(query);
      router.push(targetUrl);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="pt-12 pb-16 px-4 text-center max-w-5xl mx-auto">
      {/* Trust Badge */}
      <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200/80 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 mb-8 shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-blue-600" />
        <span>Sourced from DWI & UK Water Companies</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] mb-6 uppercase">
        Check the water hardness <br className="hidden sm:inline" />
        <span className="text-blue-500">anywhere in the UK.</span>
      </h1>

      <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
        Instant ppm, Clark degrees, and appliance salt settings across <strong>9,000+ UK Postcode Sectors</strong>. Updated for 2026.
      </p>

      {/* Big Search Input */}
      <form
        onSubmit={handleSearch}
        className="max-w-2xl mx-auto bg-white p-3 rounded-3xl shadow-xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-3"
      >
        <div className="flex items-center gap-3 px-4 py-2 w-full">
          <MapPin className="w-6 h-6 text-blue-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Postcode Sector (e.g., SW1A 1, B1 1)..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none font-medium text-base sm:text-lg"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="w-full sm:w-auto bg-slate-900 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-base shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          <span>Search</span>
        </button>
      </form>

      {/* POPULAR LINKS */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 flex-wrap">
        <span>Popular:</span>
        <Link href="/water-hardness/sw1a/sw1a-1" className="hover:underline font-medium text-slate-700">SW1A 1 (London)</Link>
        <Link href="/water-hardness/m1/m1-1" className="hover:underline font-medium text-slate-700">M1 1 (Manchester)</Link>
        <Link href="/water-hardness/b1/b1-1" className="hover:underline font-medium text-slate-700">B1 1 (Birmingham)</Link>
        <Link href="/water-hardness/eh1/eh1-1" className="hover:underline font-medium text-slate-700">EH1 1 (Edinburgh)</Link>
      </div>
    </section>
  );
}