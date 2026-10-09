"use client";

import React, { useState } from "react";
import { Droplets, Info, ShieldCheck, Mountain, Layers, MapPin } from "lucide-react";

export interface UkRegionHardness {
  id: string;
  name: string;
  ppmRange: string;
  averagePpm: number;
  clarkRange: string;
  category: "Soft" | "Moderate" | "Hard" | "Very Hard";
  color: string;
  accentColor: string;
  geologyType: string;
  waterSource: string;
  keyCities: string[];
  description: string;
}

const UK_REGIONS: Record<string, UkRegionHardness> = {
  scotland: {
    id: "scotland",
    name: "Scotland (Highlands & Lowlands)",
    ppmRange: "15 – 65 PPM",
    averagePpm: 30,
    clarkRange: "1.0 – 4.5° Clark",
    category: "Soft",
    color: "#059669", // Emerald 600
    accentColor: "#10B981",
    geologyType: "Ancient Pre-Cambrian Granite & Volcanic Schist",
    waterSource: "Upland Peat Catchments & Mountain Lochs",
    keyCities: ["Glasgow", "Edinburgh", "Aberdeen", "Dundee"],
    description: "Impermeable granitic terrain contains negligible calcium carbonate. Water flowing into reservoirs like Loch Katrine remains pristine, soft, and limescale-free.",
  },
  north_england: {
    id: "north_england",
    name: "Northern England (North West & Pennines)",
    ppmRange: "35 – 95 PPM",
    averagePpm: 55,
    clarkRange: "2.5 – 6.6° Clark",
    category: "Soft",
    color: "#0D9488", // Teal 600
    accentColor: "#14B8A6",
    geologyType: "Millstone Grit, Pennine Peat & Lake District Granite",
    waterSource: "Lake District Reservoirs (Haweswater, Thirlmere)",
    keyCities: ["Manchester", "Liverpool", "Newcastle", "Sheffield (West)"],
    description: "Supplied predominantly from high-altitude Lake District and Pennine reservoirs. Soft water lathers effortlessly and leaves virtually zero kettle scale.",
  },
  wales: {
    id: "wales",
    name: "Wales & Welsh Valleys",
    ppmRange: "30 – 85 PPM",
    averagePpm: 50,
    clarkRange: "2.1 – 6.0° Clark",
    category: "Soft",
    color: "#10B981", // Emerald 500
    accentColor: "#34D399",
    geologyType: "Palaeozoic Slate, Shale & Mudstones",
    waterSource: "Elan Valley & Brecon Beacons Reservoirs",
    keyCities: ["Cardiff", "Swansea", "Newport", "Bangor"],
    description: "High Atlantic rainfall running over insoluble Welsh slate and sandstone creates naturally soft drinking water across more than 90% of the nation.",
  },
  midlands: {
    id: "midlands",
    name: "The Midlands & Central England",
    ppmRange: "130 – 245 PPM",
    averagePpm: 185,
    clarkRange: "9.1 – 17.1° Clark",
    category: "Moderate",
    color: "#D97706", // Amber 600
    accentColor: "#F59E0B",
    geologyType: "Triassic Mercia Mudstone & Sandstone Strata",
    waterSource: "Surface River Abstractions (Derwent, Dove) & Wells",
    keyCities: ["Leicester", "Nottingham", "Derby", "Coventry"],
    description: "Sedimentary red sandstones and gypsum marls contribute dissolved calcium sulphate and carbonates, leading to moderate-to-hard tap water and kettle crusting.",
  },
  east_anglia: {
    id: "east_anglia",
    name: "East Anglia & The Fens",
    ppmRange: "280 – 360+ PPM",
    averagePpm: 325,
    clarkRange: "19.6 – 25.2° Clark",
    category: "Very Hard",
    color: "#DC2626", // Red 600
    accentColor: "#EF4444",
    geologyType: "Deep Cretaceous White Chalk & Oolitic Limestone",
    waterSource: "Underground Chalk Boreholes & Storage Reservoirs",
    keyCities: ["Cambridge", "Peterborough", "Ipswich", "Norwich"],
    description: "Among the hardest tap water in Western Europe. Rain percolating through thick subterranean chalk beds absorbs massive mineral density, causing severe boiler calcification.",
  },
  london_thames: {
    id: "london_thames",
    name: "Greater London & Thames Valley",
    ppmRange: "260 – 330 PPM",
    averagePpm: 290,
    clarkRange: "18.2 – 23.1° Clark",
    category: "Very Hard",
    color: "#E11D48", // Rose 600
    accentColor: "#F43F5E",
    geologyType: "London Basin Chalk Aquifer & Chalk Karst",
    waterSource: "River Thames Chalk Intakes & North Downs Wells",
    keyCities: ["Central London", "Woking", "Guildford", "Reading", "Watford"],
    description: "The capital and Home Counties sit in a natural chalk bowl. Mineral-saturated tap water reduces combi boiler efficiency by 7-10% without water softeners.",
  },
  south_east: {
    id: "south_east",
    name: "South Coast & Sussex Downs",
    ppmRange: "260 – 315 PPM",
    averagePpm: 285,
    clarkRange: "18.2 – 22.0° Clark",
    category: "Very Hard",
    color: "#EA580C", // Orange-Red 600
    accentColor: "#FB923C",
    geologyType: "South Downs Upper Cretaceous Chalk Ridge",
    waterSource: "100% Underground Chalk Groundwater Boreholes",
    keyCities: ["Brighton & Hove", "Portsmouth", "Canterbury", "Eastbourne"],
    description: "Abstracted entirely from deep underground boreholes across the South Downs. Extremely pure microbiologically, but deposits heavy limescale inside domestic pipework.",
  },
  south_west: {
    id: "south_west",
    name: "South West & West Country",
    ppmRange: "35 – 260 PPM (Geological Split)",
    averagePpm: 120,
    clarkRange: "2.4 – 18.2° Clark",
    category: "Moderate",
    color: "#0284C7", // Sky/Blue (Split region)
    accentColor: "#38BDF8",
    geologyType: "Dartmoor Granite (West) vs Mendip Limestone (East)",
    waterSource: "Burrator Reservoir (Plymouth) vs Mendip Springs (Bristol)",
    keyCities: ["Plymouth (Soft 35 PPM)", "Exeter (Soft 55 PPM)", "Bristol (Hard 260 PPM)"],
    description: "A stark split: Devon and Cornwall enjoy pristine soft moorland water from Dartmoor granite, while Bristol and East Devon pump hard water from limestone formations.",
  },
};

const CITY_PINS = [
  { name: "Edinburgh", x: 260, y: 195, ppm: 25, cat: "Soft" },
  { name: "Glasgow", x: 215, y: 200, ppm: 28, cat: "Soft" },
  { name: "Newcastle", x: 295, y: 265, ppm: 65, cat: "Soft" },
  { name: "Manchester", x: 265, y: 340, ppm: 45, cat: "Soft" },
  { name: "Leeds", x: 285, y: 325, ppm: 75, cat: "Soft" },
  { name: "Birmingham", x: 268, y: 405, ppm: 45, cat: "Soft" },
  { name: "Leicester", x: 298, y: 400, ppm: 245, cat: "Hard" },
  { name: "Cardiff", x: 205, y: 460, ppm: 55, cat: "Soft" },
  { name: "Cambridge", x: 345, y: 430, ppm: 335, cat: "Very Hard" },
  { name: "London", x: 325, y: 470, ppm: 285, cat: "Very Hard" },
  { name: "Bristol", x: 228, y: 470, ppm: 260, cat: "Hard" },
  { name: "Brighton", x: 320, y: 515, ppm: 285, cat: "Very Hard" },
  { name: "Plymouth", x: 155, y: 535, ppm: 35, cat: "Soft" },
];

export default function UkHardnessMapSvg({ className = "" }: { className?: string }) {
  const [activeRegionId, setActiveRegionId] = useState<string>("london_thames");
  const activeRegion = UK_REGIONS[activeRegionId] || UK_REGIONS.london_thames;

  return (
    <div className={`rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ${className}`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-50 text-blue-600">
              <Droplets className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Hydrogeological Vector Infographic
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            UK Regional Water Hardness Map
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive Drinking Water Inspectorate (DWI) catchment analysis &bull; Click any zone below
          </p>
        </div>

        {/* E-E-A-T Verified Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>DWI Data Model (2026 Cycle)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Modern Vector SVG Map */}
        <div className="lg:col-span-7 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
            <span>GREAT BRITAIN BASIN</span>
            <span>SCALE: 1:2,500,000</span>
          </div>

          <svg
            role="img"
            aria-label="UK Water Hardness Map showing soft vs hard water geographical distribution across England, Wales and Scotland"
            viewBox="0 0 460 600"
            className="w-full max-w-[420px] h-auto select-none drop-shadow-sm"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>UK Water Hardness Map - Regional PPM & Geological Catchment</title>
            <desc>
              Programmatic vector map of the United Kingdom showing water hardness levels from soft upland Scottish reservoirs to very hard South East chalk aquifers.
            </desc>

            <defs>
              {/* Subtle map glow filters */}
              <filter id="map-hover-glow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Background sea mesh accent lines */}
            <path d="M 30,120 Q 90,80 150,110" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" fill="none" />
            <path d="M 360,200 Q 420,240 450,300" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" fill="none" />
            <path d="M 20,400 Q 80,450 60,520" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" fill="none" />

            {/* ========================================================
                REGIONAL SVG PATHS & POLYGONS
                ======================================================== */}

            {/* 1. SCOTLAND */}
            <g
              onClick={() => setActiveRegionId("scotland")}
              className="cursor-pointer transition-all duration-200"
            >
              <path
                d="M 210,35 L 260,25 L 300,45 L 290,95 L 330,125 L 320,165 L 295,180 L 260,210 L 195,215 L 175,195 L 185,160 L 140,140 L 150,90 L 180,65 Z"
                fill={activeRegionId === "scotland" ? "#047857" : UK_REGIONS.scotland.color}
                stroke="#FFFFFF"
                strokeWidth={activeRegionId === "scotland" ? "3" : "1.5"}
                filter={activeRegionId === "scotland" ? "url(#map-hover-glow)" : undefined}
                className="hover:opacity-90"
              />
              <text x="235" y="125" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800" letterSpacing="1">
                SCOTLAND
              </text>
              <text x="235" y="140" textAnchor="middle" fill="#A7F3D0" fontSize="9" fontWeight="700">
                SOFT (&lt;50 PPM)
              </text>
            </g>

            {/* 2. NORTHERN ENGLAND */}
            <g
              onClick={() => setActiveRegionId("north_england")}
              className="cursor-pointer transition-all duration-200"
            >
              <path
                d="M 195,215 L 260,210 L 295,225 L 315,255 L 310,310 L 335,335 L 295,365 L 245,365 L 220,335 L 210,270 L 195,245 Z"
                fill={activeRegionId === "north_england" ? "#0F766E" : UK_REGIONS.north_england.color}
                stroke="#FFFFFF"
                strokeWidth={activeRegionId === "north_england" ? "3" : "1.5"}
                filter={activeRegionId === "north_england" ? "url(#map-hover-glow)" : undefined}
                className="hover:opacity-90"
              />
              <text x="260" y="290" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">
                NORTH ENGLAND
              </text>
              <text x="260" y="303" textAnchor="middle" fill="#99F6E4" fontSize="8" fontWeight="700">
                SOFT (35–95 PPM)
              </text>
            </g>

            {/* 3. WALES */}
            <g
              onClick={() => setActiveRegionId("wales")}
              className="cursor-pointer transition-all duration-200"
            >
              <path
                d="M 180,345 L 218,348 L 225,385 L 230,425 L 220,465 L 175,470 L 150,445 L 140,410 L 165,375 Z"
                fill={activeRegionId === "wales" ? "#059669" : UK_REGIONS.wales.color}
                stroke="#FFFFFF"
                strokeWidth={activeRegionId === "wales" ? "3" : "1.5"}
                filter={activeRegionId === "wales" ? "url(#map-hover-glow)" : undefined}
                className="hover:opacity-90"
              />
              <text x="180" y="415" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">
                WALES
              </text>
              <text x="180" y="428" textAnchor="middle" fill="#A7F3D0" fontSize="8" fontWeight="700">
                SOFT (50 PPM)
              </text>
            </g>

            {/* 4. THE MIDLANDS */}
            <g
              onClick={() => setActiveRegionId("midlands")}
              className="cursor-pointer transition-all duration-200"
            >
              <path
                d="M 245,365 L 295,365 L 335,335 L 350,370 L 335,420 L 295,445 L 245,440 L 230,425 L 225,385 Z"
                fill={activeRegionId === "midlands" ? "#B45309" : UK_REGIONS.midlands.color}
                stroke="#FFFFFF"
                strokeWidth={activeRegionId === "midlands" ? "3" : "1.5"}
                filter={activeRegionId === "midlands" ? "url(#map-hover-glow)" : undefined}
                className="hover:opacity-90"
              />
              <text x="282" y="398" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">
                MIDLANDS
              </text>
              <text x="282" y="411" textAnchor="middle" fill="#FDE68A" fontSize="8" fontWeight="700">
                MODERATE (185 PPM)
              </text>
            </g>

            {/* 5. EAST ANGLIA */}
            <g
              onClick={() => setActiveRegionId("east_anglia")}
              className="cursor-pointer transition-all duration-200"
            >
              <path
                d="M 335,335 L 380,345 L 420,380 L 415,435 L 375,455 L 340,445 L 335,420 L 350,370 Z"
                fill={activeRegionId === "east_anglia" ? "#B91C1C" : UK_REGIONS.east_anglia.color}
                stroke="#FFFFFF"
                strokeWidth={activeRegionId === "east_anglia" ? "3" : "1.5"}
                filter={activeRegionId === "east_anglia" ? "url(#map-hover-glow)" : undefined}
                className="hover:opacity-90"
              />
              <text x="375" y="395" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="800">
                EAST ANGLIA
              </text>
              <text x="375" y="408" textAnchor="middle" fill="#FECACA" fontSize="8" fontWeight="700">
                VERY HARD (325 PPM)
              </text>
            </g>

            {/* 6. SOUTH WEST */}
            <g
              onClick={() => setActiveRegionId("south_west")}
              className="cursor-pointer transition-all duration-200"
            >
              <path
                d="M 220,465 L 245,465 L 240,505 L 185,525 L 135,550 L 95,570 L 90,555 L 130,520 L 160,490 L 175,470 Z"
                fill={activeRegionId === "south_west" ? "#0369A1" : UK_REGIONS.south_west.color}
                stroke="#FFFFFF"
                strokeWidth={activeRegionId === "south_west" ? "3" : "1.5"}
                filter={activeRegionId === "south_west" ? "url(#map-hover-glow)" : undefined}
                className="hover:opacity-90"
              />
              <text x="165" y="525" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="800">
                SOUTH WEST
              </text>
              <text x="165" y="537" textAnchor="middle" fill="#BAE6FD" fontSize="8" fontWeight="700">
                SPLIT (35–260 PPM)
              </text>
            </g>

            {/* 7. GREATER LONDON & THAMES VALLEY */}
            <g
              onClick={() => setActiveRegionId("london_thames")}
              className="cursor-pointer transition-all duration-200"
            >
              <path
                d="M 245,440 L 295,445 L 340,445 L 375,455 L 365,490 L 310,495 L 255,485 L 245,465 Z"
                fill={activeRegionId === "london_thames" ? "#BE123C" : UK_REGIONS.london_thames.color}
                stroke="#FFFFFF"
                strokeWidth={activeRegionId === "london_thames" ? "3" : "1.5"}
                filter={activeRegionId === "london_thames" ? "url(#map-hover-glow)" : undefined}
                className="hover:opacity-90"
              />
              <text x="305" y="468" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="800">
                LONDON &amp; THAMES
              </text>
              <text x="305" y="479" textAnchor="middle" fill="#FECDD3" fontSize="8" fontWeight="700">
                VERY HARD (290 PPM)
              </text>
            </g>

            {/* 8. SOUTH & SOUTH EAST COAST */}
            <g
              onClick={() => setActiveRegionId("south_east")}
              className="cursor-pointer transition-all duration-200"
            >
              <path
                d="M 255,485 L 310,495 L 365,490 L 395,490 L 385,530 L 330,535 L 285,530 L 240,505 L 245,485 Z"
                fill={activeRegionId === "south_east" ? "#C2410C" : UK_REGIONS.south_east.color}
                stroke="#FFFFFF"
                strokeWidth={activeRegionId === "south_east" ? "3" : "1.5"}
                filter={activeRegionId === "south_east" ? "url(#map-hover-glow)" : undefined}
                className="hover:opacity-90"
              />
              <text x="315" y="513" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="800">
                SOUTH EAST COAST
              </text>
              <text x="315" y="524" textAnchor="middle" fill="#FFEDD5" fontSize="8" fontWeight="700">
                VERY HARD (285 PPM)
              </text>
            </g>

            {/* ========================================================
                CITY PIN LOCATORS
                ======================================================== */}
            {CITY_PINS.map((city) => (
              <g key={city.name} className="pointer-events-none">
                <circle cx={city.x} cy={city.y} r="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
                <text
                  x={city.x + 5}
                  y={city.y + 3}
                  fontSize="7.5"
                  fontWeight="700"
                  fill="#0F172A"
                  className="font-sans drop-shadow-sm select-none"
                >
                  {city.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Map bottom caption */}
          <div className="w-full text-center mt-2">
            <span className="text-[11px] text-slate-500 font-medium">
              💡 Click any region above to inspect regional PPM &amp; geological aquifers
            </span>
          </div>
        </div>

        {/* Right Side: Interactive Catchment Inspector & Legend */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Region Deep Dive Card */}
          <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Selected Basin Profile
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-extrabold text-white"
                style={{ backgroundColor: activeRegion.color }}
              >
                {activeRegion.category} ({activeRegion.averagePpm} PPM)
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
              {activeRegion.name}
            </h3>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Hardness Range</span>
                <span className="font-extrabold text-slate-900">{activeRegion.ppmRange}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Clark Scale</span>
                <span className="font-extrabold text-slate-900">{activeRegion.clarkRange}</span>
              </div>
            </div>

            {/* Geology & Source Info */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Mountain className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-semibold block text-[11px]">Underlying Geology:</strong>
                  {activeRegion.geologyType}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Droplets className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-semibold block text-[11px]">Primary Water Source:</strong>
                  {activeRegion.waterSource}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-semibold block text-[11px]">Key Cities Included:</strong>
                  {activeRegion.keyCities.join(", ")}
                </div>
              </div>
            </div>

            <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
              {activeRegion.description}
            </p>
          </div>

          {/* Color Legend & Water Source Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              UK Hardness Classification Key
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/70">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-900">Naturally Soft</span>
                </div>
                <span className="font-mono text-slate-600 text-[11px]">&lt; 100 PPM &bull; Granite/Slate</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/70">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-600 shrink-0" />
                  <span className="font-bold text-slate-900">Moderately Hard</span>
                </div>
                <span className="font-mono text-slate-600 text-[11px]">100 – 200 PPM &bull; Sandstone/River</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/70">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-orange-600 shrink-0" />
                  <span className="font-bold text-slate-900">Hard Water</span>
                </div>
                <span className="font-mono text-slate-600 text-[11px]">200 – 300 PPM &bull; Limestone/Chalk</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/70">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-600 shrink-0" />
                  <span className="font-bold text-slate-900">Very Hard Water</span>
                </div>
                <span className="font-mono text-slate-600 text-[11px]">300+ PPM &bull; Deep Chalk Aquifers</span>
              </div>
            </div>

            {/* E-E-A-T Geological Takeaway */}
            <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/70 text-[11px] text-blue-900 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Hydrogeology Rule:</strong> Water hardness across the UK is determined by whether rain falls on impermeable western/northern igneous bedrock or filters hundreds of feet through porous southern/eastern Cretaceous chalk aquifers.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
