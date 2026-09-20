"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CityData } from "@/lib/citiesData";
import {
  Search,
  Droplets,
  Building2,
  ArrowRight,
  MapPin,
  Scale,
  Sparkles,
  Filter
} from "lucide-react";

interface CitiesDirectoryClientProps {
  cities: CityData[];
}

export default function CitiesDirectoryClient({ cities }: CitiesDirectoryClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedRegionGroup, setSelectedRegionGroup] = useState<string>("All");

  const regionGroups: Record<string, string[]> = {
    "All": [],
    "London & South": ["Greater London", "South East", "South West", "East of England"],
    "Midlands": ["West Midlands", "East Midlands"],
    "North": ["North West", "Yorkshire & The Humber", "North East"],
    "Devolved Nations": ["Scotland", "Wales", "Northern Ireland"],
  };

  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      // Search match
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        city.name.toLowerCase().includes(query) ||
        city.supplier.toLowerCase().includes(query) ||
        city.region.toLowerCase().includes(query) ||
        city.outcodePrefixes.some((p) => p.toLowerCase().includes(query));

      // Category match
      const matchesCategory =
        selectedCategory === "All" || city.hardnessCategory === selectedCategory;

      // Region match
      const targetRegions = regionGroups[selectedRegionGroup] || [];
      const matchesRegion =
        selectedRegionGroup === "All" || targetRegions.includes(city.region);

      return matchesSearch && matchesCategory && matchesRegion;
    });
  }, [cities, search, selectedCategory, selectedRegionGroup]);

  return (
    <div>
      {/* Controls Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by city, supplier, or outcode (e.g. Leeds, M, Thames)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {Object.keys(regionGroups).map((group) => (
              <button
                key={group}
                onClick={() => setSelectedRegionGroup(group)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedRegionGroup === group
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Hardness Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="h-3.5 w-3.5" /> Filter by Hardness:
          </span>
          {["All", "Soft Water", "Moderately Hard", "Hard Water", "Very Hard Water"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-slate-700">
          Showing {filteredCities.length} of {cities.length} UK Cities
        </div>
        {(search || selectedCategory !== "All" || selectedRegionGroup !== "All") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
              setSelectedRegionGroup("All");
            }}
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid of City Cards */}
      {filteredCities.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-300 bg-white p-8">
          <Droplets className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No cities match your criteria</h3>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your search query or removing active filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => {
            const isSoft = city.avgPpm < 100;
            const isModerate = city.avgPpm >= 100 && city.avgPpm < 200;
            const isHard = city.avgPpm >= 200 && city.avgPpm < 300;

            return (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isSoft
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : isModerate
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : isHard
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      <Droplets className="h-3 w-3" />
                      {city.hardnessCategory}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {city.region}
                    </span>
                  </div>

                  {/* City Name & PPM */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {city.name}
                  </h3>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {city.avgPpm}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      PPM ({city.clarkDegrees}° Clark)
                    </span>
                  </div>

                  {/* Supplier */}
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                    <Building2 className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{city.supplier}</span>
                  </div>

                  {/* Neighbourhood Variance Snippet */}
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Softest:</span>
                      <strong className="text-slate-700">{city.softestArea.name} ({city.softestArea.ppm} PPM)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Hardest:</span>
                      <strong className="text-slate-700">{city.hardestArea.name} ({city.hardestArea.ppm} PPM)</strong>
                    </div>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  <span>View Postcode Breakdown</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
