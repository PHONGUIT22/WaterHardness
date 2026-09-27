"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, ArrowRight, Filter } from "lucide-react";
import { SupplierOutcodeItem } from "@/lib/data";

interface SupplierOutcodeGridProps {
  supplierName: string;
  outcodes: SupplierOutcodeItem[];
}

export default function SupplierOutcodeGrid({
  supplierName,
  outcodes,
}: SupplierOutcodeGridProps) {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return outcodes.filter((item) => {
      const matchesSearch = !q || item.outcode.toLowerCase().includes(q);
      const matchesCategory =
        selectedFilter === "all" ||
        item.hardnessCategory.toLowerCase().replace(/\s+/g, "") ===
          selectedFilter.toLowerCase().replace(/\s+/g, "");
      return matchesSearch && matchesCategory;
    });
  }, [outcodes, search, selectedFilter]);

  const getBadgeColor = (category: string, ppm: number) => {
    if (ppm < 100) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (ppm < 150) return "bg-cyan-100 text-cyan-800 border-cyan-200";
    if (ppm < 200) return "bg-amber-100 text-amber-800 border-amber-200";
    if (ppm < 300) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-rose-100 text-rose-800 border-rose-200";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600 shrink-0" />
            {supplierName} Network Postcode Outcodes ({outcodes.length})
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Search and explore official DWI water hardness readings across all postal districts supplied by {supplierName}.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search box */}
          <div className="relative min-w-[200px] sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search outcode (e.g. SW1)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs font-semibold text-slate-700 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Hardness Levels</option>
              <option value="soft">Soft (&lt;100 PPM)</option>
              <option value="moderatelysoft">Moderately Soft (100–150)</option>
              <option value="slightlyhard">Slightly Hard (150–200)</option>
              <option value="hard">Hard (200–300)</option>
              <option value="veryhard">Very Hard (&gt;300)</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-500 text-sm">
          No outcodes matching your filter criteria. Try clearing the search query.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((item) => (
            <Link
              key={item.outcode}
              href={`/water-hardness/${item.outcode.toLowerCase()}`}
              className="group flex flex-col justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-300 hover:shadow-xs transition-all duration-150"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-blue-600 text-base">
                  {item.outcode}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="mt-2 flex items-center justify-between gap-1">
                <span className="text-xs font-extrabold text-slate-800">
                  {item.avgPpm} PPM
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getBadgeColor(
                    item.hardnessCategory,
                    item.avgPpm
                  )}`}
                >
                  {item.hardnessCategory}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5">
                {item.sectorCount} {item.sectorCount === 1 ? "sector" : "sectors"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
