"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, ArrowRightLeft, Search, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Props {
  locA: string;
  locB: string;
  dataA: any;
  dataB: any;
}

export default function CompareHero({ locA, locB, dataA, dataB }: Props) {
  const [inputA, setInputA] = useState(locA);
  const [inputB, setInputB] = useState(locB);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // GIẢI MÃ SECTOR SLUG TỪ INPUT NGƯỜI DÙNG
  const resolveSectorSlug = async (inputVal: string, currentData: any, currentLoc: string) => {
    const cleanInput = inputVal.trim();
    if (!cleanInput) return "sw1a-1";

    const normalized = cleanInput.replace(/-/g, " ").toUpperCase();

    // 1. Nếu input KHÔNG ĐỔI -> Dùng luôn slug từ currentLoc
    if (normalized === currentLoc.replace(/-/g, " ").toUpperCase() && currentData) {
      return currentData.sector ? currentData.sector.toLowerCase().replace(/\s+/g, "-") : currentLoc;
    }

    // 2. Query Supabase lấy Sector mới
    const { data } = await supabase
      .from("water_hardness_sectors")
      .select("sector")
      .ilike("sector", normalized)
      .maybeSingle();

    if (data) {
      return data.sector.toLowerCase().replace(/\s+/g, "-");
    }

    // Fallback slug dạng gạch nối
    return cleanInput.toLowerCase().replace(/\s+/g, "-");
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputA.trim() || !inputB.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const [slugA, slugB] = await Promise.all([
        resolveSectorSlug(inputA, dataA, locA),
        resolveSectorSlug(inputB, dataB, locB),
      ]);

      router.push(`/compare/${slugA}-vs-${slugB}`);
    } catch (err) {
      console.error("Compare navigation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwap = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      setInputA(inputB);
      setInputB(inputA);

      const [slugA, slugB] = await Promise.all([
        resolveSectorSlug(inputB, dataB, locB),
        resolveSectorSlug(inputA, dataA, locA),
      ]);

      router.push(`/compare/${slugA}-vs-${slugB}`);
    } catch (err) {
      console.error("Swap error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-slate-900 text-white pt-12 pb-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        
        <div className="inline-flex items-center gap-2 bg-slate-800 text-cyan-400 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold mb-6">
          <Scale className="w-4 h-4 text-cyan-400" /> Side-by-Side Water Hardness Calculator
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase mb-4">
          Compare Water Hardness
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-10">
          Analyze real-time PPM, Clark degrees, limescale risk, and dishwasher salt settings between any two UK postcode sectors.
        </p>

        {/* 2 Ô SEARCH SONG SONG + NÚT SWAP */}
        <form onSubmit={handleCompare} className="max-w-3xl mx-auto bg-slate-800/90 p-4 rounded-3xl border border-slate-700 shadow-xl flex flex-col md:flex-row items-center gap-3">
          
          <div className="relative w-full">
            <MapPin className="w-5 h-5 text-cyan-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              placeholder="Sector A (e.g. SW1A 1)"
              className="w-full bg-slate-900/80 text-white placeholder-slate-500 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            type="button"
            onClick={handleSwap}
            title="Swap Sectors"
            disabled={isSubmitting}
            className="p-3 bg-slate-700 hover:bg-cyan-600 text-white rounded-2xl transition-colors shrink-0 cursor-pointer disabled:opacity-50"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>

          <div className="relative w-full">
            <MapPin className="w-5 h-5 text-cyan-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              placeholder="Sector B (e.g. AB10 1)"
              className="w-full bg-slate-900/80 text-white placeholder-slate-500 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3.5 rounded-2xl transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Compare</span>
          </button>
        </form>

      </div>
    </section>
  );
}