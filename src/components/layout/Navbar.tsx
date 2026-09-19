"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, Scale, Loader2, Droplet } from "lucide-react";
import { resolveSearchDestination } from "@/lib/search";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || isSearching) return;

    setIsSearching(true);
    try {
      const targetUrl = await resolveSearchDestination(searchTerm);
      router.push(targetUrl);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* LOGO GÓC TRÁI */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white shadow-sm">
            <Droplet className="w-5 h-5 fill-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 hidden sm:inline">
            WaterHardness<span className="text-cyan-600">.uk</span>
          </span>
        </Link>

        {/* THANH SEARCH THÔNG MINH (Chỉ dẫn mã bưu điện UK) */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-2 sm:mx-6">
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-cyan-600 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Postcode or Area (e.g. SW1A 1, AB10, London)..."
              className="w-full bg-slate-100/80 focus:bg-white border border-transparent focus:border-cyan-600 rounded-full pl-10 pr-10 py-2 text-xs sm:text-sm font-medium focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 p-1.5 bg-slate-900 hover:bg-cyan-600 text-white rounded-full transition-colors disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>

        {/* LINKS GÓC PHẢI */}
        <div className="flex items-center gap-3 shrink-0">
          <nav className="hidden lg:flex items-center gap-6 font-medium text-slate-600 text-sm mr-2">
            <Link href="/guides" className="hover:text-slate-900 transition-colors">
              Guides & Blog
            </Link>
            <Link href="/outcodes" className="hover:text-slate-900 transition-colors">
              All Outcodes
            </Link>
            <Link href="/about" className="hover:text-slate-900 transition-colors">
              WSZ Methodology
            </Link>
          </nav>

          <Link
            href="/compare"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all text-xs sm:text-sm shadow-sm flex items-center gap-2"
          >
            <Scale className="w-4 h-4" />
            <span className="hidden sm:inline">Compare Areas</span>
          </Link>
        </div>

      </div>
    </header>
  );
}