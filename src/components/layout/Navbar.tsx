"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Droplet, Menu, X } from "lucide-react";
import LiveSearchAutocomplete from "@/components/search/LiveSearchAutocomplete";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* LOGO GÓC TRÁI */}
        <Link 
          href="/" 
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white shadow-sm shrink-0">
            <Droplet className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 hidden sm:inline">
            WaterHardness<span className="text-cyan-600">.uk</span>
          </span>
        </Link>

        {/* THANH SEARCH THÔNG MINH AUTOCOMPLETE */}
        <div className="flex-1 min-w-0 max-w-md mx-1 sm:mx-6">
          <LiveSearchAutocomplete
            variant="navbar"
            placeholder="Search Postcode, City, or Tool..."
            onSelect={() => setIsMobileMenuOpen(false)}
          />
        </div>

        {/* LINKS GÓC PHẢI */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <nav className="hidden lg:flex items-center gap-6 font-medium text-slate-600 text-sm mr-2">
            <Link href="/cities" className="hover:text-slate-900 transition-colors">
              UK Cities
            </Link>
            <Link href="/suppliers" className="hover:text-slate-900 transition-colors">
              Water Suppliers
            </Link>
            <Link href="/guides" className="hover:text-slate-900 transition-colors">
              Guides &amp; Blog
            </Link>
            <Link href="/tools/dishwasher-salt-calculator" className="hover:text-slate-900 transition-colors flex items-center gap-1.5 font-semibold text-cyan-700">
              <span>Salt Calculator</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-100 text-cyan-800 tracking-wide uppercase">Tool</span>
            </Link>
            <Link href="/outcodes" className="hover:text-slate-900 transition-colors">
              All Outcodes
            </Link>
            <Link href="/about" className="hover:text-slate-900 transition-colors">
              WSZ Methodology
            </Link>
          </nav>

          {/* COMPARE BUTTON: Hiển thị trên tablet/desktop, ẩn trên mobile nhỏ để nhường chỗ cho hamburger */}
          <Link
            href="/compare"
            className="hidden sm:inline-flex bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all text-xs sm:text-sm shadow-sm items-center gap-1.5 sm:gap-2 shrink-0"
          >
            <Scale className="w-4 h-4" />
            <span className="hidden md:inline">Compare Areas</span>
            <span className="md:hidden">Compare</span>
          </Link>

          {/* HAMBURGER BUTTON TRÊN MOBILE/TABLET */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-cyan-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shrink-0"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>

      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white/98 shadow-xl transition-all">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1.5">
            {/* Salt Calculator (Nổi bật với badge Tool, màu cyan) */}
            <Link
              href="/tools/dishwasher-salt-calculator"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-900 font-bold text-sm hover:bg-cyan-100/80 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🧂</span>
                <span>Dishwasher Salt Calculator</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-600 text-white uppercase tracking-wider shadow-2xs">
                Tool
              </span>
            </Link>

            {/* UK Cities */}
            <Link
              href="/cities"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl text-slate-700 hover:text-cyan-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
            >
              <span className="text-lg">🏙️</span>
              <span>UK Cities</span>
            </Link>

            {/* Water Suppliers */}
            <Link
              href="/suppliers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl text-slate-700 hover:text-cyan-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
            >
              <span className="text-lg">🏢</span>
              <span>Water Suppliers</span>
            </Link>

            {/* Guides & Blog */}
            <Link
              href="/guides"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl text-slate-700 hover:text-cyan-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
            >
              <span className="text-lg">📚</span>
              <span>Guides &amp; Blog</span>
            </Link>

            {/* Compare Areas */}
            <Link
              href="/compare"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl text-slate-700 hover:text-cyan-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
            >
              <span className="text-lg">⚖️</span>
              <span>Compare Areas</span>
            </Link>

            {/* All Outcodes */}
            <Link
              href="/outcodes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl text-slate-700 hover:text-cyan-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
            >
              <span className="text-lg">🗺️</span>
              <span>All Outcodes</span>
            </Link>

            {/* WSZ Methodology */}
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl text-slate-700 hover:text-cyan-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
            >
              <span className="text-lg">ℹ️</span>
              <span>WSZ Methodology &amp; Data</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}