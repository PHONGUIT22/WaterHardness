"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, ArrowRight } from "lucide-react";

interface OutcodeItem {
  outcode: string;
  company: string;
  count: number;
}

interface CityOutcodeGridProps {
  cityName: string;
  outcodes: OutcodeItem[];
}

export default function CityOutcodeGrid({ cityName, outcodes }: CityOutcodeGridProps) {
  const [search, setSearch] = useState("");

  const filtered = outcodes.filter((item) =>
    item.outcode.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            {cityName} Postcode Outcodes ({outcodes.length})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse local water hardness data and sector breakdowns across all {cityName} postal districts.
          </p>
        </div>

        {outcodes.length > 8 && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter outcode (e.g. SW1)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          No outcodes matching &ldquo;{search}&rdquo;. Try another search term.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((item) => (
            <Link
              key={item.outcode}
              href={`/water-hardness/${item.outcode.toLowerCase()}`}
              className="group flex flex-col justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all duration-150"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-blue-600 text-base">
                  {item.outcode}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {item.count} {item.count === 1 ? "sector" : "sectors"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
