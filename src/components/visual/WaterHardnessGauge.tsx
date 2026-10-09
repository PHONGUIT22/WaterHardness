import React from "react";

export interface WaterHardnessGaugeProps {
  ppm: number;
  outcodeOrCityName: string;
  category?: string;
  className?: string;
  showDetails?: boolean;
}

/**
 * Standard UK Drinking Water Inspectorate (DWI) Hardness Band Definition
 */
interface HardnessBand {
  id: "soft" | "moderate" | "hard" | "very-hard";
  name: string;
  ppmRange: string;
  color: string;
  strokeColor: string;
  bgColor: string;
  textColor: string;
  startAngle: number; // in degrees (0 = far left, 180 = far right)
  endAngle: number;
}

const HARDNESS_BANDS: HardnessBand[] = [
  {
    id: "soft",
    name: "Soft",
    ppmRange: "0 – 100 PPM",
    color: "#10B981", // Emerald 500
    strokeColor: "#059669",
    bgColor: "bg-emerald-50 border-emerald-200 text-emerald-800",
    textColor: "text-emerald-700",
    startAngle: 1.5,
    endAngle: 43.5,
  },
  {
    id: "moderate",
    name: "Moderate",
    ppmRange: "101 – 200 PPM",
    color: "#EAB308", // Yellow / Amber 500
    strokeColor: "#CA8A04",
    bgColor: "bg-amber-50 border-amber-200 text-amber-800",
    textColor: "text-amber-700",
    startAngle: 46.5,
    endAngle: 88.5,
  },
  {
    id: "hard",
    name: "Hard",
    ppmRange: "201 – 300 PPM",
    color: "#F97316", // Orange 500
    strokeColor: "#EA580C",
    bgColor: "bg-orange-50 border-orange-200 text-orange-800",
    textColor: "text-orange-700",
    startAngle: 91.5,
    endAngle: 133.5,
  },
  {
    id: "very-hard",
    name: "Very Hard",
    ppmRange: "300+ PPM",
    color: "#EF4444", // Vivid Red / Rose 500
    strokeColor: "#DC2626",
    bgColor: "bg-rose-50 border-rose-200 text-rose-800",
    textColor: "text-rose-700",
    startAngle: 136.5,
    endAngle: 178.5,
  },
];

/**
 * Maps PPM value (0 - 450+) to needle angle (0° to 180°)
 * 0 - 100 PPM    -> 0° to 45°
 * 101 - 200 PPM  -> 45° to 90°
 * 201 - 300 PPM  -> 90° to 135°
 * 301 - 450+ PPM -> 135° to 180°
 */
function getNeedleAngle(ppm: number): number {
  const safePpm = Math.max(0, Math.min(ppm, 450));
  if (safePpm <= 100) {
    return (safePpm / 100) * 45;
  }
  if (safePpm <= 200) {
    return 45 + ((safePpm - 100) / 100) * 45;
  }
  if (safePpm <= 300) {
    return 90 + ((safePpm - 200) / 100) * 45;
  }
  return 135 + (Math.min(safePpm - 300, 150) / 150) * 45;
}

/**
 * Resolves UK category name if not provided
 */
function resolveCategory(ppm: number, explicitCategory?: string): string {
  if (explicitCategory && explicitCategory.trim().length > 0) {
    return explicitCategory;
  }
  if (ppm < 100) return "Soft Water";
  if (ppm < 200) return "Moderately Hard";
  if (ppm < 300) return "Hard Water";
  return "Very Hard Water";
}

/**
 * Calculates SVG Arc path coordinates for a semi-circle track segment
 */
function createArcPath(
  cx: number,
  cy: number,
  radius: number,
  startDeg: number,
  endDeg: number
): string {
  const startRad = (startDeg * Math.PI) / 180;
  const endRad = (endDeg * Math.PI) / 180;

  // Arc curves from left to right clockwise
  const x1 = cx - radius * Math.cos(startRad);
  const y1 = cy - radius * Math.sin(startRad);
  const x2 = cx - radius * Math.cos(endRad);
  const y2 = cy - radius * Math.sin(endRad);

  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export default function WaterHardnessGauge({
  ppm,
  outcodeOrCityName,
  category,
  className = "",
  showDetails = true,
}: WaterHardnessGaugeProps) {
  const resolvedCategory = resolveCategory(ppm, category);
  const needleAngle = getNeedleAngle(ppm);

  // SVG dimensions
  const viewBoxWidth = 320;
  const viewBoxHeight = 220;
  const cx = 160;
  const cy = 155;
  const radius = 108;
  const strokeWidth = 20;
  const needleLength = 92;

  // Active band selection
  const activeBand =
    ppm < 100
      ? HARDNESS_BANDS[0]
      : ppm <= 200
      ? HARDNESS_BANDS[1]
      : ppm <= 300
      ? HARDNESS_BANDS[2]
      : HARDNESS_BANDS[3];

  // Tick positions around arc
  const tickMarkers = [
    { label: "0", angle: 0 },
    { label: "100", angle: 45 },
    { label: "200", angle: 90 },
    { label: "300", angle: 135 },
    { label: "400+", angle: 180 },
  ];

  const clarkDegrees = (ppm * 0.07).toFixed(1);
  const frenchDegrees = (ppm * 0.1).toFixed(1);

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Water Hardness Meter
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {outcodeOrCityName}
          </h3>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${activeBand.bgColor}`}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: activeBand.color }}
          />
          {resolvedCategory}
        </span>
      </div>

      {/* SVG Speedometer Gauge */}
      <div className="relative flex items-center justify-center">
        <svg
          role="img"
          aria-label={`Water hardness speedometer gauge for ${outcodeOrCityName} measuring ${ppm} PPM CaCO3`}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full max-w-[290px] h-auto overflow-visible select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>
            {`Water Hardness Gauge - ${outcodeOrCityName} (${ppm} PPM)`}
          </title>
          <desc>
            {`Official water hardness gauge for ${outcodeOrCityName} measuring ${ppm} PPM CaCO3`}
          </desc>

          <defs>
            {/* Subtle glow filter for the needle center and active elements */}
            <filter
              id="gauge-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#0F172A"
                floodOpacity="0.18"
              />
            </filter>
            <filter id="active-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="4"
                floodColor={activeBand.color}
                floodOpacity="0.45"
              />
            </filter>
          </defs>

          {/* Background Track Guide (Light muted arc) */}
          <path
            d={createArcPath(cx, cy, radius, 0, 180)}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
          />

          {/* 4 Standard UK Hardness Bands */}
          {HARDNESS_BANDS.map((band) => {
            const isActive = band.id === activeBand.id;
            return (
              <g key={band.id}>
                <path
                  d={createArcPath(
                    cx,
                    cy,
                    radius,
                    band.startAngle,
                    band.endAngle
                  )}
                  fill="none"
                  stroke={band.color}
                  strokeWidth={isActive ? strokeWidth + 2 : strokeWidth}
                  strokeLinecap="round"
                  filter={isActive ? "url(#active-glow)" : undefined}
                  className="transition-all duration-300"
                  opacity={isActive ? 1 : 0.82}
                />
              </g>
            );
          })}

          {/* Scale Numeric Tick Labels */}
          {tickMarkers.map((tick) => {
            const tickRad = (tick.angle * Math.PI) / 180;
            const labelRadius = radius - 26;
            const tx = cx - labelRadius * Math.cos(tickRad);
            const ty = cy - labelRadius * Math.sin(tickRad);

            return (
              <text
                key={tick.label}
                x={tx.toFixed(1)}
                y={ty.toFixed(1)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                fontWeight="700"
                fill="#64748B"
                className="font-mono select-none"
              >
                {tick.label}
              </text>
            );
          })}

          {/* Center Pointer Needle */}
          {/* Base needle orientation: straight UP at cy - needleLength. Rotate by (needleAngle - 90) */}
          <g
            transform={`rotate(${(needleAngle - 90).toFixed(2)}, ${cx}, ${cy})`}
            className="transition-transform duration-700 ease-out"
            filter="url(#gauge-shadow)"
          >
            {/* Needle Body (Tapered polygon) */}
            <polygon
              points={`${cx},${cy - needleLength} ${cx - 3.5},${cy} ${cx},${cy + 10} ${cx + 3.5},${cy}`}
              fill="#0F172A"
            />
            {/* Needle Tip Indicator (Vivid active color) */}
            <polygon
              points={`${cx},${cy - needleLength} ${cx - 2},${cy - needleLength + 22} ${cx + 2},${cy - needleLength + 22}`}
              fill={activeBand.color}
            />
          </g>

          {/* Central Pivot Hub */}
          <circle
            cx={cx}
            cy={cy}
            r="11"
            fill="#0F172A"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            filter="url(#gauge-shadow)"
          />
          <circle cx={cx} cy={cy} r="4" fill={activeBand.color} />

          {/* Center Digital Readout Box */}
          <g transform={`translate(${cx}, ${cy + 28})`}>
            {/* Big PPM Number */}
            <text
              x="0"
              y="0"
              textAnchor="middle"
              className="font-extrabold fill-slate-900 font-sans select-none"
              fontSize="24"
              fontWeight="900"
              letterSpacing="-0.03em"
            >
              {ppm} <tspan fontSize="13" fontWeight="700" fill="#64748B">PPM</tspan>
            </text>

            {/* Classification Subtitle */}
            <text
              x="0"
              y="18"
              textAnchor="middle"
              className="font-bold fill-slate-600 font-sans select-none tracking-wide"
              fontSize="11"
            >
              {resolvedCategory}
            </text>
          </g>
        </svg>
      </div>

      {/* Visual Color Scale Reference Bar */}
      <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-slate-100 text-center">
        {HARDNESS_BANDS.map((band) => {
          const isCurrent = band.id === activeBand.id;
          return (
            <div
              key={band.id}
              className={`rounded-lg px-1.5 py-1 transition-all ${
                isCurrent
                  ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-900"
                  : "bg-slate-50 text-slate-500"
              }`}
            >
              <div
                className="w-2.5 h-1 rounded-full mx-auto mb-1"
                style={{ backgroundColor: band.color }}
              />
              <span className="block text-[10px] font-bold leading-tight">
                {band.name}
              </span>
              <span className="block text-[9px] opacity-75 font-mono">
                {band.ppmRange.replace(" PPM", "")}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed Conversion Metrics (E-E-A-T Technical Specs) */}
      {showDetails && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div>
            <span className="text-slate-400 block text-[10px]">English Scale</span>
            <span className="font-bold text-slate-800">{clarkDegrees}° Clark</span>
          </div>
          <div className="text-center">
            <span className="text-slate-400 block text-[10px]">French Scale</span>
            <span className="font-bold text-slate-800">{frenchDegrees}°fH</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">Chemical Spec</span>
            <span className="font-bold text-slate-800">{ppm} mg/L CaCO₃</span>
          </div>
        </div>
      )}
    </div>
  );
}
