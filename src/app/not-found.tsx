"use client";

import Link from "next/link";
import { Home, Compass } from "lucide-react";
import LiveSearchAutocomplete from "@/components/search/LiveSearchAutocomplete";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#FDFDFD] text-slate-900 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* 404 Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 text-cyan-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-cyan-600" /> Error 404 • Area Not Found
        </div>

        {/* Headline 404 Siêu Bự */}
        <div>
          <h1 className="text-7xl sm:text-9xl font-black text-slate-900 tracking-tight leading-none mb-4">
            404<span className="text-cyan-600">.</span>
          </h1>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 uppercase tracking-tight">
            Lost in the Postcodes?
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base max-w-md mx-auto">
            We couldn&apos;t find the specific postcode sector, outcode, or page you were looking for. Search our database of 9,000+ UK postcode sectors below.
          </p>
        </div>

        {/* Ô Search Tải Lại Ngay Tại Trang 404 */}
        <div className="max-w-lg mx-auto w-full">
          <LiveSearchAutocomplete
            variant="hero"
            placeholder="Search Postcode, City, or Supplier..."
          />
        </div>

        {/* Nút Quay Về Trang Chủ & Link Các Vùng Nổi Bật UK */}
        <div className="pt-6 border-t border-slate-200/80 space-y-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold px-5 py-2.5 rounded-full text-xs transition-colors"
            >
              <Home className="w-4 h-4 text-cyan-600" /> Go to Homepage
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-5 py-2.5 rounded-full text-xs transition-colors shadow-xs"
            >
              Compare Hardness Tool
            </Link>
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-center gap-2 flex-wrap">
            <span>Or explore major areas:</span>
            <Link href="/water-hardness/sw1a" className="font-semibold text-slate-700 hover:text-cyan-600 underline">SW1A (London)</Link> •
            <Link href="/water-hardness/m1" className="font-semibold text-slate-700 hover:text-cyan-600 underline">M1 (Manchester)</Link> •
            <Link href="/water-hardness/b1" className="font-semibold text-slate-700 hover:text-cyan-600 underline">B1 (Birmingham)</Link> •
            <Link href="/water-hardness/eh1" className="font-semibold text-slate-700 hover:text-cyan-600 underline">EH1 (Edinburgh)</Link>
          </div>
        </div>

      </div>
    </div>
  );
}