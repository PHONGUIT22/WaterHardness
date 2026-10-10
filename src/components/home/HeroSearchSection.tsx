"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import LiveSearchAutocomplete from "@/components/search/LiveSearchAutocomplete";

export default function HeroSearchSection() {
  return (
    <section className="pt-12 pb-16 px-4 text-center max-w-5xl mx-auto">
      {/* Trust Badge */}
      <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200/80 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 mb-8 shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-blue-600" />
        <span>Sourced from DWI &amp; UK Water Companies</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] mb-6 uppercase">
        Check the water hardness <br className="hidden sm:inline" />
        <span className="text-blue-500">anywhere in the UK.</span>
      </h1>

      <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
        Instant ppm, Clark degrees, and appliance salt settings across <strong>9,000+ UK Postcode Sectors</strong>. Updated for 2026.
      </p>

      {/* High-Performance Live Search Autocomplete */}
      <div className="max-w-2xl mx-auto">
        <LiveSearchAutocomplete
          variant="hero"
          placeholder="Enter Postcode Sector, City or Supplier (e.g., SW1A 1, London, Thames Water)..."
        />
      </div>

      {/* POPULAR LINKS */}
      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500 flex-wrap">
        <span>Popular:</span>
        <Link href="/water-hardness/sw1a/sw1a-1" className="hover:underline font-medium text-slate-700">SW1A 1 (London)</Link>
        <Link href="/water-hardness/m1/m1-1" className="hover:underline font-medium text-slate-700">M1 1 (Manchester)</Link>
        <Link href="/water-hardness/b1/b1-1" className="hover:underline font-medium text-slate-700">B1 1 (Birmingham)</Link>
        <Link href="/water-hardness/eh1/eh1-1" className="hover:underline font-medium text-slate-700">EH1 1 (Edinburgh)</Link>
      </div>
    </section>
  );
}