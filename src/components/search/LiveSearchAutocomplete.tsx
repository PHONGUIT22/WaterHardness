"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Building2,
  Droplet,
  Compass,
  Sparkles,
  Loader2,
  X,
  ArrowRight,
} from "lucide-react";
import { resolveSearchDestination } from "@/lib/search";
import {
  SearchSuggestResponse,
  SearchSuggestCity,
  SearchSuggestSupplier,
  SearchSuggestOutcode,
  SearchSuggestSector,
  SearchSuggestTool,
} from "@/app/api/search/suggest/route";

interface LiveSearchAutocompleteProps {
  variant?: "hero" | "navbar";
  placeholder?: string;
  onSelect?: () => void;
  className?: string;
}

interface FlatSuggestionItem {
  id: string;
  type: "tool" | "city" | "outcode" | "sector" | "supplier" | "fallback";
  title: string;
  subtitle?: string;
  badge?: string;
  avgPpm?: number;
  url: string;
}

function getPpmBadge(ppm: number) {
  if (ppm < 100) {
    return {
      label: `${ppm} PPM • Soft`,
      classes: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold",
    };
  }
  if (ppm <= 200) {
    return {
      label: `${ppm} PPM • Moderate`,
      classes: "bg-amber-50 text-amber-700 border-amber-200/80 font-bold",
    };
  }
  if (ppm <= 300) {
    return {
      label: `${ppm} PPM • Hard`,
      classes: "bg-orange-50 text-orange-700 border-orange-200/80 font-bold",
    };
  }
  return {
    label: `${ppm} PPM • Very Hard`,
    classes: "bg-rose-50 text-rose-700 border-rose-200/80 font-bold",
  };
}

export default function LiveSearchAutocomplete({
  variant = "hero",
  placeholder,
  onSelect,
  className = "",
}: LiveSearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Click outside listener to dismiss dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // 2. Debounced API fetcher (150ms)
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions(null);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data: SearchSuggestResponse = await res.json();
          setSuggestions(data);
          setIsOpen(true);
          setSelectedIndex(-1);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Autocomplete fetch error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // 3. Flatten suggestions for continuous keyboard navigation
  const flatItems: FlatSuggestionItem[] = useMemo(() => {
    if (!suggestions) return [];
    const list: FlatSuggestionItem[] = [];

    // Tools
    suggestions.tools.forEach((t: SearchSuggestTool) => {
      list.push({
        id: `tool-${t.url}`,
        type: "tool",
        title: t.title,
        subtitle: t.description,
        badge: t.badge,
        url: t.url,
      });
    });

    // Cities
    suggestions.cities.forEach((c: SearchSuggestCity) => {
      list.push({
        id: `city-${c.slug}`,
        type: "city",
        title: c.name,
        subtitle: c.region,
        avgPpm: c.avgPpm,
        url: c.url,
      });
    });

    // Outcodes
    suggestions.outcodes.forEach((o: SearchSuggestOutcode) => {
      list.push({
        id: `outcode-${o.outcode}`,
        type: "outcode",
        title: o.outcode,
        subtitle: o.cityName ? `${o.cityName} • ${o.companyName}` : o.companyName,
        avgPpm: o.avgPpm,
        url: o.url,
      });
    });

    // Sectors
    suggestions.sectors.forEach((s: SearchSuggestSector) => {
      list.push({
        id: `sector-${s.sector}`,
        type: "sector",
        title: s.sector,
        subtitle: s.companyName || s.hardnessCategory,
        avgPpm: s.avgPpm,
        url: s.url,
      });
    });

    // Suppliers
    suggestions.suppliers.forEach((sup: SearchSuggestSupplier) => {
      list.push({
        id: `supplier-${sup.slug}`,
        type: "supplier",
        title: sup.name,
        subtitle: sup.region,
        url: sup.url,
      });
    });

    return list;
  }, [suggestions]);

  // 4. Handle item navigation
  const navigateTo = (url: string) => {
    setIsOpen(false);
    onSelect?.();
    router.push(url);
  };

  // 5. Submit search handler (fallback resolver)
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isSubmitting) return;

    // If an item is highlighted via keyboard, go to that item
    if (selectedIndex >= 0 && selectedIndex < flatItems.length) {
      navigateTo(flatItems[selectedIndex].url);
      return;
    }

    setIsSubmitting(true);
    setIsOpen(false);
    try {
      const destination = await resolveSearchDestination(trimmed);
      onSelect?.();
      router.push(destination);
    } catch (err) {
      console.error("Search resolution error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (!isOpen || flatItems.length === 0) {
      if (e.key === "Enter") {
        handleSubmit();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasSuggestions = flatItems.length > 0;
  const isHero = variant === "hero";

  const defaultPlaceholder = isHero
    ? "Enter Postcode Sector, City or Supplier (e.g., SW1A 1, London, Thames Water)..."
    : "Search Postcode, City, or Tool (e.g. SW1A, London)...";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* INPUT FORM CONTAINER */}
      {isHero ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-2.5 sm:p-3 rounded-3xl shadow-xl border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 transition-shadow focus-within:ring-4 focus-within:ring-cyan-500/10 focus-within:border-cyan-500"
        >
          <div className="flex items-center gap-3 px-3 sm:px-4 py-1.5 w-full">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (query.trim() && hasSuggestions) setIsOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || defaultPlaceholder}
              autoComplete="off"
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none font-medium text-base sm:text-lg"
            />
            {isLoading && (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 animate-spin shrink-0" />
            )}
            {query && !isLoading && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-slate-900 hover:bg-cyan-600 text-white font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base shrink-0 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span>Search</span>
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="relative flex items-center w-full">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600 absolute left-3 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim() && hasSuggestions) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || defaultPlaceholder}
            autoComplete="off"
            className="w-full bg-slate-100/90 focus:bg-white border border-transparent focus:border-cyan-600 rounded-full pl-8 sm:pl-10 pr-14 sm:pr-16 py-1.5 sm:py-2 text-xs sm:text-sm font-medium focus:outline-none transition-all truncate"
          />
          <div className="absolute right-1.5 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
                aria-label="Clear query"
              >
                <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="p-1 sm:p-1.5 bg-slate-900 hover:bg-cyan-600 text-white rounded-full transition-colors disabled:opacity-50"
              aria-label="Submit search"
            >
              {isSubmitting || isLoading ? (
                <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
              ) : (
                <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              )}
            </button>
          </div>
        </form>
      )}

      {/* DROPDOWN AUTOCOMPLETE MENU */}
      {isOpen && query.trim().length > 0 && (
        <div
          className={`absolute z-[100] bg-white border border-slate-200/90 shadow-2xl overflow-hidden overflow-y-auto text-left transition-all animate-in fade-in-50 duration-150 ${
            isHero
              ? "left-0 right-0 top-full mt-2.5 rounded-3xl max-h-96"
              : "left-0 right-0 sm:left-auto sm:right-0 sm:w-[460px] top-full mt-2 rounded-2xl max-h-80 sm:max-h-96"
          }`}
        >
          {hasSuggestions ? (
            <div className="divide-y divide-slate-100 py-1">
              {/* Category: Tools & Calculators */}
              {suggestions && suggestions.tools.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Tools &amp; Interactive Features</span>
                  </div>
                  {suggestions.tools.map((t) => {
                    const idx = flatItems.findIndex((item) => item.id === `tool-${t.url}`);
                    const isSelected = selectedIndex === idx;
                    return (
                      <button
                        key={t.url}
                        type="button"
                        onClick={() => navigateTo(t.url)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                          isSelected ? "bg-cyan-50/90 text-cyan-950" : "hover:bg-slate-50 text-slate-800"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-sm flex items-center gap-2">
                            <span>{t.title}</span>
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-600 text-white uppercase tracking-wider">
                              {t.badge}
                            </span>
                          </div>
                          {t.description && (
                            <div className="text-xs text-slate-500 truncate mt-0.5">{t.description}</div>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-cyan-600 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Category: UK Cities */}
              {suggestions && suggestions.cities.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>UK Major Cities</span>
                  </div>
                  {suggestions.cities.map((c) => {
                    const idx = flatItems.findIndex((item) => item.id === `city-${c.slug}`);
                    const isSelected = selectedIndex === idx;
                    const badge = getPpmBadge(c.avgPpm);
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => navigateTo(c.url)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                          isSelected ? "bg-cyan-50/90 text-cyan-950" : "hover:bg-slate-50 text-slate-800"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-slate-900">{c.name}</div>
                          <div className="text-xs text-slate-500 truncate">{c.region}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs border ${badge.classes}`}
                          >
                            {badge.label}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Category: Outcodes */}
              {suggestions && suggestions.outcodes.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Postcode Districts (Outcodes)</span>
                  </div>
                  {suggestions.outcodes.map((o) => {
                    const idx = flatItems.findIndex((item) => item.id === `outcode-${o.outcode}`);
                    const isSelected = selectedIndex === idx;
                    const badge = getPpmBadge(o.avgPpm);
                    return (
                      <button
                        key={o.outcode}
                        type="button"
                        onClick={() => navigateTo(o.url)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                          isSelected ? "bg-cyan-50/90 text-cyan-950" : "hover:bg-slate-50 text-slate-800"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                            <span>{o.outcode}</span>
                            {o.cityName && (
                              <span className="text-xs font-medium text-slate-600">
                                • {o.cityName}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 truncate">{o.companyName}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs border ${badge.classes}`}
                          >
                            {badge.label}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Category: Sectors */}
              {suggestions && suggestions.sectors.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-slate-400" />
                    <span>Specific Postcode Sectors</span>
                  </div>
                  {suggestions.sectors.map((s) => {
                    const idx = flatItems.findIndex((item) => item.id === `sector-${s.sector}`);
                    const isSelected = selectedIndex === idx;
                    const badge = getPpmBadge(s.avgPpm);
                    return (
                      <button
                        key={s.sector}
                        type="button"
                        onClick={() => navigateTo(s.url)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                          isSelected ? "bg-cyan-50/90 text-cyan-950" : "hover:bg-slate-50 text-slate-800"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-slate-900">{s.sector}</div>
                          <div className="text-xs text-slate-500 truncate">
                            {s.companyName || s.hardnessCategory}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs border ${badge.classes}`}
                          >
                            {badge.label}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Category: Water Suppliers */}
              {suggestions && suggestions.suppliers.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-slate-400" />
                    <span>Regional Water Companies</span>
                  </div>
                  {suggestions.suppliers.map((sup) => {
                    const idx = flatItems.findIndex((item) => item.id === `supplier-${sup.slug}`);
                    const isSelected = selectedIndex === idx;
                    return (
                      <button
                        key={sup.slug}
                        type="button"
                        onClick={() => navigateTo(sup.url)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                          isSelected ? "bg-cyan-50/90 text-cyan-950" : "hover:bg-slate-50 text-slate-800"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-slate-900">{sup.name}</div>
                          <div className="text-xs text-slate-500 truncate">{sup.region}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Fallback Action at Bottom */}
              <div className="p-2 bg-slate-50/70">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-cyan-800 hover:text-cyan-950 hover:bg-white flex items-center justify-between gap-2 transition-colors"
                >
                  <span>
                    Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">Enter</kbd> to search all database records for &ldquo;{query}&rdquo;
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* No direct category match */
            <div className="p-5 text-center space-y-2">
              <div className="text-xs text-slate-500 font-medium">
                No immediate preview found for &ldquo;<span className="font-bold text-slate-800">{query}</span>&rdquo;.
              </div>
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs transition-colors shadow-2xs"
              >
                <span>Search Full Database</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
