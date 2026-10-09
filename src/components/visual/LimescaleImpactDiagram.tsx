"use client";

import React, { useState } from "react";
import {
  Flame,
  Zap,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Info,
  ShieldAlert,
  Thermometer,
  ArrowRight,
  PoundSterling,
} from "lucide-react";

export interface LimescaleImpactDiagramProps {
  /**
   * Average annual household gas heating bill in GBP (Defaults to £1,200 under UK Ofgem price cap)
   */
  annualGasBill?: number;
  /**
   * Initial scale thickness selected in mm (Defaults to 1.5mm as per BS 7593 / Carbon Trust benchmark)
   */
  initialScaleThicknessMm?: 0.5 | 1.0 | 1.5 | 3.0;
  /**
   * Optional custom CSS class name
   */
  className?: string;
  /**
   * Whether to display the technical BS 7593 / Part L regulatory standards breakdown
   */
  showStandardsGuide?: boolean;
}

interface ScaleThicknessLevel {
  mm: 0.5 | 1.0 | 1.5 | 3.0;
  label: string;
  efficiencyLossPct: number;
  boreReductionPct: number;
  severity: "low" | "moderate" | "high" | "critical";
  severityLabel: string;
  badgeBg: string;
  badgeText: string;
  symptoms: string;
  pipeScaleRadiusSvg: number; // inner visual radius offset in SVG
  coreWaterRadiusSvg: number;
}

const SCALE_LEVELS: Record<number, ScaleThicknessLevel> = {
  0.5: {
    mm: 0.5,
    label: "0.5 mm Thin Film",
    efficiencyLossPct: 3.5,
    boreReductionPct: 7,
    severity: "low",
    severityLabel: "Early Accumulation",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    badgeText: "text-amber-700",
    symptoms: "Minor cloudy chalk film on kettle heating elements, faint showerhead nozzle crusting.",
    pipeScaleRadiusSvg: 8,
    coreWaterRadiusSvg: 47,
  },
  1.0: {
    mm: 1.0,
    label: "1.0 mm Moderate Crust",
    efficiencyLossPct: 7.5,
    boreReductionPct: 15,
    severity: "moderate",
    severityLabel: "Moderate Scale",
    badgeBg: "bg-orange-100 text-orange-900 border-orange-300",
    badgeText: "text-orange-700",
    symptoms: "Hot water cylinders take 15% longer to recover temperature; tap aerators choke with flakes.",
    pipeScaleRadiusSvg: 16,
    coreWaterRadiusSvg: 39,
  },
  1.5: {
    mm: 1.5,
    label: "1.5 mm BS 7593 Benchmark",
    efficiencyLossPct: 12.0,
    boreReductionPct: 24,
    severity: "high",
    severityLabel: "Carbon Trust Benchmark",
    badgeBg: "bg-rose-100 text-rose-900 border-rose-300",
    badgeText: "text-rose-700",
    symptoms: "Boiler kettling sounds (rattling/banging); heat exchanger skin temperature climbs dangerously.",
    pipeScaleRadiusSvg: 24,
    coreWaterRadiusSvg: 31,
  },
  3.0: {
    mm: 3.0,
    label: "3.0 mm Severe Choking",
    efficiencyLossPct: 25.0,
    boreReductionPct: 48,
    severity: "critical",
    severityLabel: "Critical Choking",
    badgeBg: "bg-red-200 text-red-950 border-red-400",
    badgeText: "text-red-800",
    symptoms: "Severe boiler short-cycling, pump cavitation, localized hot spots causing heat exchanger fractures.",
    pipeScaleRadiusSvg: 36,
    coreWaterRadiusSvg: 19,
  },
};

/**
 * LimescaleImpactDiagram
 *
 * Vector SVG technical diagram demonstrating the thermal barrier mechanism of
 * Calcium Carbonate (CaCO3) limescale encrustation inside domestic central heating
 * boiler copper heat exchanger pipes. Compliant with BS 7593:2019 and Building Regs Part L.
 */
export const LimescaleImpactDiagram: React.FC<LimescaleImpactDiagramProps> = ({
  annualGasBill = 1200,
  initialScaleThicknessMm = 1.5,
  className = "",
  showStandardsGuide = true,
}) => {
  const [selectedThickness, setSelectedThickness] = useState<0.5 | 1.0 | 1.5 | 3.0>(
    initialScaleThicknessMm
  );

  const activeLevel = SCALE_LEVELS[selectedThickness];
  const annualWastePounds = Math.round((annualGasBill * activeLevel.efficiencyLossPct) / 100);
  const tenYearWastePounds = annualWastePounds * 10;

  return (
    <div
      className={`w-full rounded-2xl border border-slate-200 bg-white p-5 md:p-8 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 ${className}`}
      data-testid="limescale-impact-diagram"
    >
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-800 dark:bg-orange-950/80 dark:text-orange-300">
            <Flame className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
            Thermal Physics & Energy Loss Model
          </div>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900 md:text-2xl dark:text-slate-100">
            Boiler Heat Exchanger: Clean Pipe vs Limescale Encrustation
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Comparing thermal heat flux conduction across 99.9% deoxidised copper versus insulating{" "}
            <span className="font-medium text-slate-900 dark:text-slate-200">calcium carbonate (CaCO₃)</span> scale.
          </p>
        </div>

        {/* Dynamic Annual Penalty Metric */}
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3 px-4 dark:border-rose-900/50 dark:bg-rose-950/30">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-white shadow-sm dark:bg-rose-700">
            <PoundSterling className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-rose-700 dark:text-rose-300">
              Annual Fuel Penalty ({activeLevel.mm}mm Scale)
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-rose-900 dark:text-rose-100">
                +£{annualWastePounds}
              </span>
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                /year ({activeLevel.efficiencyLossPct}% extra gas)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Scale Thickness Selector Bar */}
      <div className="my-6">
        <div className="mb-2.5 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>SELECT LIMESCALE THICKNESS TO SIMULATE IMPACT:</span>
          <span>Baseline Gas Bill: £{annualGasBill.toLocaleString()}/yr</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {([0.5, 1.0, 1.5, 3.0] as const).map((mm) => {
            const level = SCALE_LEVELS[mm];
            const isSelected = selectedThickness === mm;
            return (
              <button
                key={mm}
                type="button"
                onClick={() => setSelectedThickness(mm)}
                className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-rose-600 bg-rose-50/70 shadow-sm ring-2 ring-rose-500/20 dark:border-rose-500 dark:bg-rose-950/40"
                    : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`text-sm font-bold ${
                      isSelected
                        ? "text-rose-900 dark:text-rose-200"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {level.mm} mm
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      isSelected
                        ? "bg-rose-600 text-white"
                        : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    +{level.efficiencyLossPct}% Fuel
                  </span>
                </div>
                <span className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {level.severityLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vector SVG Cross-Section Comparison Graphic */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-slate-900 to-slate-950 p-4 shadow-inner md:p-6">
        <svg
          viewBox="0 0 860 410"
          className="h-auto w-full select-none"
          role="img"
          aria-label={`Boiler heat exchanger cross section comparing clean copper tube against ${activeLevel.mm}mm limescale encrustation resulting in ${activeLevel.efficiencyLossPct}% efficiency penalty.`}
          aria-labelledby="limescale-diagram-title limescale-diagram-desc"
        >
          <title id="limescale-diagram-title">
            Technical Cross-Section: Heat Exchanger Limescale Impact (BS 7593 Compliance)
          </title>
          <desc id="limescale-diagram-desc">
            Comparative schematic showing 100% thermal flux conduction in clean copper pipe versus
            severe thermal deflection and bore constriction caused by calcium carbonate scale crust.
          </desc>

          {/* Definitions for Gradients, Patterns and Filters */}
          <defs>
            {/* Copper Pipe Outer Gradient */}
            <linearGradient id="copperWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="40%" stopColor="#F97316" />
              <stop offset="70%" stopColor="#C2410C" />
              <stop offset="100%" stopColor="#9A3412" />
            </linearGradient>

            {/* Overheated Copper Wall Gradient (Stress) */}
            <linearGradient id="copperHotWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="30%" stopColor="#EA580C" />
              <stop offset="70%" stopColor="#991B1B" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>

            {/* Pure Laminar Water Gradient */}
            <radialGradient id="cleanWaterGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#0284C7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="1" />
            </radialGradient>

            {/* Constricted Turbulent Water Gradient */}
            <radialGradient id="constrictedWaterGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#075985" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0C4A6E" stopOpacity="1" />
            </radialGradient>

            {/* Chalky Calcium Carbonate Scale Gradient */}
            <linearGradient id="limescaleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="35%" stopColor="#CBD5E1" />
              <stop offset="70%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            {/* Thermal Arrow Glow */}
            <filter id="thermalGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Hotspot Overheat Glow */}
            <filter id="hotspotGlow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 1  0 0.3 0 0 0  0 0 0 0 0  0 0 0 1 0"
              />
              <feBlend in="SourceGraphic" mode="screen" />
            </filter>

            {/* Limescale Crystalline Stipple Pattern */}
            <pattern id="scaleStipple" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.9" fill="#475569" opacity="0.6" />
              <circle cx="7" cy="5" r="1.1" fill="#FFFFFF" opacity="0.5" />
              <circle cx="4" cy="8" r="0.8" fill="#334155" opacity="0.7" />
              <path d="M 1 9 L 3 7 M 6 2 L 9 3" stroke="#64748B" strokeWidth="0.5" opacity="0.6" />
            </pattern>

            {/* Marker for Heat Arrows */}
            <marker id="heatArrowHead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#F59E0B" />
            </marker>
            <marker id="blockedArrowHead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#EF4444" />
            </marker>
          </defs>

          {/* Center Dividing Guideline */}
          <line
            x1="430"
            y1="30"
            x2="430"
            y2="385"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="5,5"
          />

          {/* ========================================================= */}
          {/* LEFT SIDE: CLEAN HEAT EXCHANGER TUBE (0.0mm SCALE)        */}
          {/* ========================================================= */}
          <g transform="translate(0, 0)">
            {/* Header Badge */}
            <rect
              x="50"
              y="22"
              width="330"
              height="34"
              rx="6"
              fill="#064E3B"
              fillOpacity="0.85"
              stroke="#059669"
              strokeWidth="1"
            />
            <circle cx="72" cy="39" r="6" fill="#10B981" />
            <text
              x="86"
              y="44"
              fill="#ECFDF5"
              fontSize="13"
              fontWeight="700"
              letterSpacing="0.03em"
            >
              CLEAN COPPER TUBE (0.0mm SCALE)
            </text>

            {/* Sub-label */}
            <text x="215" y="74" fill="#94A3B8" fontSize="11" textAnchor="middle">
              Optimal Baseline • 100% Thermal Flux Conductance
            </text>

            {/* External Gas Combustion Flame Zone Indicator */}
            <rect
              x="50"
              y="92"
              width="330"
              height="20"
              rx="4"
              fill="#7C2D12"
              fillOpacity="0.4"
              stroke="#EA580C"
              strokeWidth="0.8"
            />
            <text x="215" y="106" fill="#FED7AA" fontSize="10" fontWeight="600" textAnchor="middle">
              EXTERNAL COMBUSTION CHAMBER (FLUE GAS ~800°C)
            </text>

            {/* Radiant Inward Heat Transfer Arrows (Top to Center) */}
            <g filter="url(#thermalGlow)">
              <line x1="140" y1="116" x2="165" y2="155" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#heatArrowHead)" />
              <line x1="215" y1="116" x2="215" y2="155" stroke="#F59E0B" strokeWidth="3.5" markerEnd="url(#heatArrowHead)" />
              <line x1="290" y1="116" x2="265" y2="155" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#heatArrowHead)" />
            </g>

            {/* Radiant Inward Heat Transfer Arrows (Bottom to Center) */}
            <g filter="url(#thermalGlow)">
              <line x1="140" y1="316" x2="165" y2="277" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#heatArrowHead)" />
              <line x1="215" y1="316" x2="215" y2="277" stroke="#F59E0B" strokeWidth="3.5" markerEnd="url(#heatArrowHead)" />
              <line x1="290" y1="316" x2="265" y2="277" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#heatArrowHead)" />
            </g>

            {/* Pipe Cross-Section: Outer Copper Wall (Radius: 65) */}
            <circle
              cx="215"
              cy="216"
              r="68"
              fill="url(#copperWallGrad)"
              stroke="#EA580C"
              strokeWidth="1.5"
            />

            {/* Copper Wall Inner Cutout / Lumen (Radius: 55) */}
            {/* Since it's clean, the entire internal lumen is open to circulating water */}
            <circle
              cx="215"
              cy="216"
              r="55"
              fill="url(#cleanWaterGrad)"
              stroke="#38BDF8"
              strokeWidth="1.5"
            />

            {/* Laminar Water Flow Waves & Indicators */}
            <path
              d="M 180 205 Q 197 198, 215 205 T 250 205"
              fill="none"
              stroke="#E0F2FE"
              strokeWidth="2"
              strokeOpacity="0.85"
            />
            <path
              d="M 175 216 Q 195 208, 215 216 T 255 216"
              fill="none"
              stroke="#BAE6FD"
              strokeWidth="2.5"
              strokeOpacity="0.95"
            />
            <path
              d="M 180 227 Q 197 220, 215 227 T 250 227"
              fill="none"
              stroke="#E0F2FE"
              strokeWidth="2"
              strokeOpacity="0.85"
            />

            {/* Flow Direction Chevron */}
            <polygon points="213 211, 221 216, 213 221" fill="#FFFFFF" />

            {/* Callout Pointer: Copper Conductivity */}
            <line x1="265" y1="172" x2="310" y2="150" stroke="#F97316" strokeWidth="1" />
            <circle cx="310" cy="150" r="2.5" fill="#F97316" />
            <text x="316" y="146" fill="#FDBA74" fontSize="10" fontWeight="700">
              COPPER TUBE WALL
            </text>
            <text x="316" y="159" fill="#CBD5E1" fontSize="9">
              k ≈ 385 W/m·K (High)
            </text>

            {/* Callout Pointer: Free Water Core */}
            <line x1="215" y1="216" x2="115" y2="245" stroke="#38BDF8" strokeWidth="1" />
            <circle cx="115" cy="245" r="2.5" fill="#38BDF8" />
            <text x="110" y="242" fill="#7DD3FC" fontSize="10" fontWeight="700" textAnchor="end">
              100% UNRESTRICTED BORE
            </text>
            <text x="110" y="255" fill="#CBD5E1" fontSize="9" textAnchor="end">
              Optimum Reynolds Velocity
            </text>

            {/* Bottom Performance Card Left */}
            <rect
              x="50"
              y="336"
              width="330"
              height="52"
              rx="8"
              fill="#0F172A"
              stroke="#1E293B"
              strokeWidth="1"
            />
            <g transform="translate(62, 347)">
              <text x="0" y="12" fill="#10B981" fontSize="12" fontWeight="700">
                100% Rated Boiler Efficiency
              </text>
              <text x="0" y="28" fill="#94A3B8" fontSize="10">
                Heat transfer across copper wall completes in milliseconds
              </text>
            </g>
            <g transform="translate(365, 347)">
              <text x="0" y="12" fill="#10B981" fontSize="13" fontWeight="800" textAnchor="end">
                £0 / yr
              </text>
              <text x="0" y="26" fill="#6EE7B7" fontSize="9" textAnchor="end">
                Energy Waste
              </text>
            </g>
          </g>

          {/* ========================================================= */}
          {/* RIGHT SIDE: SCALED HEAT EXCHANGER TUBE (CaCO3 ENCRUSTED)  */}
          {/* ========================================================= */}
          <g transform="translate(430, 0)">
            {/* Header Badge */}
            <rect
              x="50"
              y="22"
              width="330"
              height="34"
              rx="6"
              fill="#7F1D1D"
              fillOpacity="0.85"
              stroke="#DC2626"
              strokeWidth="1"
            />
            <circle cx="72" cy="39" r="6" fill="#EF4444" />
            <text
              x="86"
              y="44"
              fill="#FEF2F2"
              fontSize="13"
              fontWeight="700"
              letterSpacing="0.03em"
            >
              SCALED TUBE ({activeLevel.mm}mm CaCO₃ CRUST)
            </text>

            {/* Sub-label */}
            <text x="215" y="74" fill="#FCA5A5" fontSize="11" textAnchor="middle">
              Thermal Insulation Barrier • +{activeLevel.efficiencyLossPct}% Fuel Penalty (BS 7593)
            </text>

            {/* External Combustion Chamber Warning */}
            <rect
              x="50"
              y="92"
              width="330"
              height="20"
              rx="4"
              fill="#7C2D12"
              fillOpacity="0.5"
              stroke="#DC2626"
              strokeWidth="0.8"
            />
            <text x="215" y="106" fill="#FCA5A5" fontSize="10" fontWeight="600" textAnchor="middle">
              COMBUSTION CHAMBER (HEAT BLOCKED FROM ENTERING WATER)
            </text>

            {/* Blocked / Reflected Heat Arrows (Top) */}
            <g filter="url(#thermalGlow)">
              {/* Deflected heat arrows bouncing off the insulating barrier */}
              <path
                d="M 140 116 L 165 148 Q 170 156, 155 160"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                markerEnd="url(#blockedArrowHead)"
              />
              <path
                d="M 215 116 L 215 148 Q 215 158, 200 155"
                fill="none"
                stroke="#EF4444"
                strokeWidth="3"
                markerEnd="url(#blockedArrowHead)"
              />
              <path
                d="M 290 116 L 265 148 Q 260 156, 275 160"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                markerEnd="url(#blockedArrowHead)"
              />
            </g>

            {/* Blocked / Reflected Heat Arrows (Bottom) */}
            <g filter="url(#thermalGlow)">
              <path
                d="M 140 316 L 165 284 Q 170 276, 155 272"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                markerEnd="url(#blockedArrowHead)"
              />
              <path
                d="M 215 316 L 215 284 Q 215 274, 200 277"
                fill="none"
                stroke="#EF4444"
                strokeWidth="3"
                markerEnd="url(#blockedArrowHead)"
              />
              <path
                d="M 290 316 L 265 284 Q 260 276, 275 272"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                markerEnd="url(#blockedArrowHead)"
              />
            </g>

            {/* Overheated Hotspot Halo on Copper Shell */}
            <circle
              cx="215"
              cy="216"
              r="71"
              fill="none"
              stroke="#DC2626"
              strokeWidth="2"
              strokeDasharray="4,3"
              filter="url(#hotspotGlow)"
              opacity="0.75"
            />

            {/* Pipe Cross-Section: Overstressed Copper Wall (Radius: 68) */}
            <circle
              cx="215"
              cy="216"
              r="68"
              fill="url(#copperHotWallGrad)"
              stroke="#DC2626"
              strokeWidth="1.5"
            />

            {/* Annular Limescale Ring (Radius: 55, thickness determined by activeLevel.pipeScaleRadiusSvg) */}
            <circle
              cx="215"
              cy="216"
              r="55"
              fill="url(#limescaleGrad)"
              stroke="#94A3B8"
              strokeWidth="1"
            />
            {/* Limescale Crystalline Stipple Texture Overlay */}
            <circle
              cx="215"
              cy="216"
              r="55"
              fill="url(#scaleStipple)"
            />

            {/* Constricted Water Flow Lumen */}
            <circle
              cx="215"
              cy="216"
              r={activeLevel.coreWaterRadiusSvg}
              fill="url(#constrictedWaterGrad)"
              stroke="#0284C7"
              strokeWidth="1.5"
            />

            {/* Constricted Turbulent Flow Lines */}
            <path
              d={`M ${215 - activeLevel.coreWaterRadiusSvg + 6} 210 Q 215 204, ${215 + activeLevel.coreWaterRadiusSvg - 6} 210`}
              fill="none"
              stroke="#7DD3FC"
              strokeWidth="1.5"
              strokeOpacity="0.7"
            />
            <path
              d={`M ${215 - activeLevel.coreWaterRadiusSvg + 6} 222 Q 215 228, ${215 + activeLevel.coreWaterRadiusSvg - 6} 222`}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeOpacity="0.7"
            />

            {/* Callout Pointer: Limescale Thermal Insulator */}
            <line x1="250" y1="185" x2="310" y2="150" stroke="#CBD5E1" strokeWidth="1" />
            <circle cx="310" cy="150" r="2.5" fill="#CBD5E1" />
            <text x="316" y="146" fill="#F1F5F9" fontSize="10" fontWeight="700">
              LIMESCALE (CaCO₃) CRUST
            </text>
            <text x="316" y="159" fill="#FCA5A5" fontSize="9" fontWeight="600">
              k ≈ 1.3 W/m·K (&gt;170x worse!)
            </text>

            {/* Callout Pointer: Constricted Core */}
            <line
              x1={215 - activeLevel.coreWaterRadiusSvg / 2}
              y1={216 + activeLevel.coreWaterRadiusSvg / 2}
              x2="115"
              y2="245"
              stroke="#F87171"
              strokeWidth="1"
            />
            <circle cx="115" cy="245" r="2.5" fill="#F87171" />
            <text x="110" y="242" fill="#FCA5A5" fontSize="10" fontWeight="700" textAnchor="end">
              CHOKED WATER BORE
            </text>
            <text x="110" y="255" fill="#FCA5A5" fontSize="9" textAnchor="end">
              -{activeLevel.boreReductionPct}% Cross-Section Area
            </text>

            {/* Warning Stamp: Boiler Hotspotting & Kettling */}
            <rect
              x="130"
              y="280"
              width="170"
              height="20"
              rx="4"
              fill="#450A0A"
              stroke="#DC2626"
              strokeWidth="1"
            />
            <text x="215" y="294" fill="#FECACA" fontSize="9" fontWeight="700" textAnchor="middle">
              HOTSPOTTING & KETTLING NOISE
            </text>

            {/* Bottom Performance Card Right */}
            <rect
              x="50"
              y="336"
              width="330"
              height="52"
              rx="8"
              fill="#0F172A"
              stroke="#7F1D1D"
              strokeWidth="1"
            />
            <g transform="translate(62, 347)">
              <text x="0" y="12" fill="#F87171" fontSize="12" fontWeight="700">
                +{activeLevel.efficiencyLossPct}% Fuel Penalty (BS 7593)
              </text>
              <text x="0" y="28" fill="#94A3B8" fontSize="10">
                Flue gas carries unabsorbed heat straight out the chimney
              </text>
            </g>
            <g transform="translate(365, 347)">
              <text x="0" y="12" fill="#EF4444" fontSize="13" fontWeight="800" textAnchor="end">
                +£{annualWastePounds} / yr
              </text>
              <text x="0" y="26" fill="#FCA5A5" fontSize="9" textAnchor="end">
                Extra Gas Wasted
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Financial & Operational Impact Analysis Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Efficiency Drop */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Boiler Efficiency Drop</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
            -{activeLevel.efficiencyLossPct}%
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Thermal transfer delay verified by UK Carbon Trust boiler field studies.
          </p>
        </div>

        {/* Metric 2: 10-Year Fuel Cost */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <PoundSterling className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">10-Year Extra Fuel Cost</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
            £{tenYearWastePounds.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Cumulative money lost directly through unabsorbed boiler flue gases.
          </p>
        </div>

        {/* Metric 3: Water Bore Restriction */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Zap className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Hydraulic Bore Choked</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
            -{activeLevel.boreReductionPct}%
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Narrowed internal pipe diameter strains the central heating circulation pump.
          </p>
        </div>

        {/* Metric 4: Thermal Conductivity Factor */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Thermometer className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Thermal Conductivity</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
            &gt;170x Worse
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Copper (385 W/m·K) vs Limescale (1.3 W/m·K) acts like rockwool lagging inside the pipe.
          </p>
        </div>
      </div>

      {/* Symptom Checklist for Active Thickness */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-600 dark:text-slate-400" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
              Observable Household Symptoms at {activeLevel.mm}mm Limescale:
            </span>
            <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-300">
              {activeLevel.symptoms}
            </p>
          </div>
        </div>
      </div>

      {/* Regulatory & Engineering Standards Guide (BS 7593 / Part L) */}
      {showStandardsGuide && (
        <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
            UK Regulatory & Industry Compliance Framework
          </h4>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Standard 1: BS 7593 */}
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 text-sm">
                <ShieldAlert className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                BS 7593:2019 Code of Practice
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Mandates water treatment in wet central heating systems. For hard water regions (&gt;200 PPM),
                inline scale reduction or water softening is required to prevent heat exchanger scaling and preserve boiler efficiency.
              </p>
            </div>

            {/* Standard 2: Building Regs Part L */}
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Building Regulations Part L
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Specifies that where domestic mains water hardness exceeds 200 mg/L (PPM) as CaCO₃,
                provisions must be made to treat the feed water to water heaters to curb carbon emissions and fuel waste.
              </p>
            </div>

            {/* Standard 3: Manufacturer Warranty Protection */}
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 text-sm">
                <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                Boiler Manufacturer Warranties
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Major UK manufacturers (Worcester Bosch, Vaillant, Ideal, Baxi) explicitly exclude heat exchanger
                failures caused by limescale encrustation and kettling from standard 5-to-10 year warranty guarantees.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LimescaleImpactDiagram;
