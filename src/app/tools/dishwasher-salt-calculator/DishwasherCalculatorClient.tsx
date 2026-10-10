"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  DISHWASHER_BRANDS,
  calculateDishwasherCalibration,
  DishwasherCalibrationResult
} from "@/lib/dishwasherCalculator";
import {
  WashingMachine,
  Search,
  Loader2,
  Sparkles,
  ShieldCheck,
  Flame,
  ExternalLink,
  Info,
  CheckCircle2,
  ArrowRight,
  Sliders,
  MapPin,
  HelpCircle,
  AlertTriangle
} from "lucide-react";

interface DishwasherCalculatorClientProps {
  initialOutcode?: string;
  initialBrand?: string;
  initialPpm?: number;
  initialLocationName?: string;
}

export default function DishwasherCalculatorClient({
  initialOutcode = "",
  initialBrand = "bosch",
  initialPpm = 275,
  initialLocationName = ""
}: DishwasherCalculatorClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const paramOutcode = searchParams.get("outcode") || initialOutcode;
  const paramBrand = searchParams.get("brand") || initialBrand;
  const paramPpm = Number(searchParams.get("ppm")) || (initialOutcode ? initialPpm : 275);

  const [postcodeQuery, setPostcodeQuery] = useState(paramOutcode);
  const [selectedBrand, setSelectedBrand] = useState(paramBrand);
  const [ppmValue, setPpmValue] = useState(paramPpm);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [matchedOutcode, setMatchedOutcode] = useState(paramOutcode);
  const [locationName, setLocationName] = useState(initialLocationName);

  // Perform lookup when paramOutcode changes
  useEffect(() => {
    if (paramOutcode && paramOutcode !== matchedOutcode) {
      handleLookup(paramOutcode);
    }
  }, [paramOutcode]);

  const handleLookup = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;
    setIsSearching(true);
    setSearchError("");

    try {
      const res = await fetch(`/api/hardness-lookup?query=${encodeURIComponent(queryToSearch.trim())}`);
      const data = await res.json();

      if (data.success && data.found) {
        setPpmValue(data.avgPpm);
        setMatchedOutcode(data.outcode);
        setLocationName(data.locationName || data.outcode);

        // Update URL query params without full page reload
        startTransition(() => {
          const params = new URLSearchParams(window.location.search);
          params.set("outcode", data.outcode.toLowerCase());
          params.set("brand", selectedBrand);
          router.replace(`/tools/dishwasher-salt-calculator?${params.toString()}`, { scroll: false });
        });
      } else {
        setSearchError(data.message || "Postcode not found. You can adjust the PPM slider manually below.");
      }
    } catch (err) {
      console.error("Lookup error:", err);
      setSearchError("Unable to fetch live water data. Please adjust PPM manually.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(postcodeQuery);
  };

  const handleBrandChange = (newBrand: string) => {
    setSelectedBrand(newBrand);
    startTransition(() => {
      const params = new URLSearchParams(window.location.search);
      if (matchedOutcode) params.set("outcode", matchedOutcode.toLowerCase());
      params.set("brand", newBrand);
      router.replace(`/tools/dishwasher-salt-calculator?${params.toString()}`, { scroll: false });
    });
  };

  const handlePresetSelect = (outcode: string, ppm: number, city: string) => {
    setPostcodeQuery(outcode);
    setMatchedOutcode(outcode);
    setPpmValue(ppm);
    setLocationName(city);
    setSearchError("");

    startTransition(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("outcode", outcode.toLowerCase());
      params.set("brand", selectedBrand);
      router.replace(`/tools/dishwasher-salt-calculator?${params.toString()}`, { scroll: false });
    });
  };

  const result: DishwasherCalibrationResult = calculateDishwasherCalibration(
    selectedBrand,
    ppmValue
  );

  return (
    <div className="space-y-8">
      {/* TOOL INPUT CONTROLS */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Postcode / Outcode Input */}
          <div className="lg:col-span-6 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Enter UK Postcode or Outcode
            </label>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <MapPin className="w-4 h-4 text-cyan-600 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={postcodeQuery}
                onChange={(e) => setPostcodeQuery(e.target.value)}
                placeholder="e.g. GU21, SW1A, BS8, RG1, M14..."
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-cyan-600 rounded-2xl pl-10 pr-24 py-3 text-sm font-semibold focus:outline-none transition-all uppercase"
              />
              <button
                type="submit"
                disabled={isSearching || !postcodeQuery.trim()}
                className="absolute right-1.5 px-4 py-2 bg-slate-900 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Lookup</span>
                  </>
                )}
              </button>
            </form>

            {searchError ? (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{searchError}</span>
              </p>
            ) : matchedOutcode ? (
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Matched Outcode: <strong>{matchedOutcode}</strong>
                  {locationName && ` (${locationName})`} — Official DWI testing record.
                </span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                Type any postal outcode (e.g. SW1A, GU21, BS1) or city to load local mineral readings.
              </p>
            )}

            {/* Quick Regional Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Popular Regional Benchmarks:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { code: "SW1A", city: "London", ppm: 278 },
                  { code: "BS1", city: "Bristol", ppm: 225 },
                  { code: "RG1", city: "Reading", ppm: 295 },
                  { code: "B1", city: "Birmingham", ppm: 130 },
                  { code: "M1", city: "Manchester", ppm: 45 },
                  { code: "OX1", city: "Oxford", ppm: 290 },
                  { code: "SO14", city: "Southampton", ppm: 295 }
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handlePresetSelect(item.code, item.ppm, item.city)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      matchedOutcode.toUpperCase() === item.code
                        ? "bg-cyan-50 border-cyan-400 text-cyan-800 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.city} ({item.ppm} PPM)
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dishwasher Brand Selector */}
          <div className="lg:col-span-6 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Select Dishwasher Manufacturer
            </label>
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-cyan-600 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none transition-all cursor-pointer appearance-none"
              >
                {DISHWASHER_BRANDS.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name} — {brand.scaleType}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                ▼
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Active Scale: <span className="font-semibold text-slate-700">{result.brand.scaleType}</span>
            </p>

            {/* Manual PPM Slider */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-600" />
                  Manual Water Hardness Fine-Tuning:
                </span>
                <span className="text-cyan-700 text-sm font-extrabold bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200">
                  {ppmValue} PPM ({result.clarkDegrees}° Clark)
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="450"
                step="5"
                value={ppmValue}
                onChange={(e) => setPpmValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>0 PPM (Soft)</span>
                <span>100 PPM</span>
                <span>200 PPM (UK Avg)</span>
                <span>300 PPM</span>
                <span>400+ PPM (Very Hard)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RESULT CARDS & SPECIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Recommendation Card */}
        <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/30 text-cyan-400 flex items-center justify-center font-bold">
                  <WashingMachine className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                    Target Appliance
                  </span>
                  <span className="text-lg font-black text-white">
                    {result.brand.name} Dishwasher
                  </span>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                  result.hardnessCategory === "Very Hard Water"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                    : result.hardnessCategory === "Hard Water"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : result.hardnessCategory === "Moderately Hard"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                }`}
              >
                {result.hardnessCategory} ({result.ppm} PPM)
              </span>
            </div>

            {/* BIG SETTING DISPLAY */}
            <div className="my-6 p-6 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-center">
              <span className="text-xs uppercase tracking-wider font-bold text-cyan-400 block mb-1">
                Official Manufacturer Recommended Dial Setting
              </span>
              <div className="text-5xl sm:text-6xl font-black text-white tracking-tight my-2">
                {result.settingCode}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                {result.settingExplanation}
              </p>
            </div>

            {/* Key Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-4">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Monthly Salt</span>
                <span className="text-base font-extrabold text-cyan-300 mt-0.5 block">
                  {result.saltConsumptionMonthly}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Clark Scale</span>
                <span className="text-base font-extrabold text-white mt-0.5 block">
                  {result.clarkDegrees}° Clark
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">German Scale</span>
                <span className="text-base font-extrabold text-white mt-0.5 block">
                  {result.germanDegrees}°dH
                </span>
              </div>
            </div>
          </div>

          {/* Monitization CTA */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Only use high-purity coarse granular salt to avoid resin bed clogging.
            </span>
            <a
              href="https://www.amazon.co.uk/s?k=dishwasher+salt+granular+finish&tag=pseowater-21"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-sm shrink-0"
            >
              <span>Check Dishwasher Salt on Amazon UK</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Step-by-Step Programming & Expert Advice */}
        <div className="lg:col-span-5 space-y-6">
          {/* How to Program Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span>How to Calibrate Your {result.brand.name} Machine</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {result.brand.programmingGuide}
            </p>
            <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-100 text-xs text-cyan-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-cyan-700" /> Rinse Aid Calibration:
              </span>
              <p className="text-[11px] leading-relaxed text-slate-600">
                {result.rinseAidAdvice}
              </p>
            </div>
          </div>

          {/* Technical Maintenance Advice */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Engineer Recommendations</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              {result.maintenanceAdvice.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-cyan-600 font-bold mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* STRATEGIC LINKING BOX: BOILER & WHOLE-HOUSE SCALE ALERT */}
      {result.ppm >= 180 && (
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-white p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-0.5">
                Central Heating Efficiency Warning
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                High Limescale Risk in {matchedOutcode || "This Area"} ({result.ppm} PPM)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                While dishwasher salt protects glassware, tap water at <strong>{result.ppm} PPM</strong> also forms calcium deposits on combi boiler plate heat exchangers, adding up to £150+ to annual gas heating bills under British Standard BS 7593.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {matchedOutcode && (
              <Link
                href={`/water-hardness/${matchedOutcode.toLowerCase()}`}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>View {matchedOutcode} Outcode Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            <Link
              href="/compare"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs"
            >
              Compare Areas
            </Link>
          </div>
        </div>
      )}

      {/* FAQ SECTION ON DISHWASHER SALT */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Frequently Asked Questions: UK Dishwasher Salt
            </h3>
            <p className="text-xs text-slate-500">
              Technical answers regarding hard water scaling, all-in-one tablets, and dial calibrations
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Can I just use All-in-One dishwasher tablets instead of dishwasher salt?",
              a: "In soft water regions (<100 PPM), all-in-one tablets containing salt substitutes may be adequate. However, in hard water regions (>200 PPM, such as London, the South East, and the Thames Valley), all-in-one tablets are insufficient. Tablets dissolve during the main wash and are drained away before the final hot rinse. The final rinse uses raw mains tap water; without salt in the internal softener unit, calcium carbonate precipitates onto hot glassware, leaving permanent cloudy etching."
            },
            {
              q: "Can I use standard cooking salt or table salt in my dishwasher?",
              a: "Never use table salt, cooking salt, rock salt, or sea salt in a dishwasher. Food-grade salts contain fine grains and anti-caking additives (such as sodium hexacyanoferrate) that clog and chemically degrade the delicate synthetic ion-exchange resin bed. Dishwasher salt is 99.4%+ pure coarse sodium chloride specifically crystallized to dissolve slowly without compacting."
            },
            {
              q: "What should I do if I have a whole-house water softener installed?",
              a: "If your kitchen cold supply feeds through an approved ion-exchange water softener, your water is already softened to <20 PPM. Set your dishwasher hardness dial to the lowest setting (e.g. H:00 on Bosch, Level 1 on Beko, or 1–4°dH on Miele). Leaving the dishwasher setting high when incoming water is already soft causes excess sodium and can accelerate glass corrosion."
            },
            {
              q: "How often should I refill the dishwasher salt reservoir in the UK?",
              a: "In a moderate water area (100–200 PPM), a 1.5kg salt reservoir typically lasts 6 to 8 weeks with daily cycles. In hard or very hard water areas (250–350+ PPM), the reservoir may require refilling every 3 to 4 weeks. Always run a short rinse cycle immediately after filling to wash away any loose granules and avoid corrosive pitting on the stainless steel floor."
            }
          ].map((item, index) => (
            <div key={index} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm">{item.q}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
