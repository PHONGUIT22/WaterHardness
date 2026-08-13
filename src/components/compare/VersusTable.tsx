import { ArrowDown, Droplets, Gauge, Building2, WashingMachine, ShieldAlert, Layers } from "lucide-react";

interface SectorCompareData {
  sector: string;
  outcode: string;
  companyName: string;
  avgPpm: number;
  clarkDegrees: number;
  hardnessCategory: string;
  boschSaltSetting: string;
  postcodeCount: number;
}

interface Props {
  dataA: SectorCompareData;
  dataB: SectorCompareData;
}

export default function VersusTable({ dataA, dataB }: Props) {
  const diffPpm = Math.abs(dataA.avgPpm - dataB.avgPpm);
  const isASofter = dataA.avgPpm <= dataB.avgPpm;

  return (
    <div className="max-w-5xl mx-auto px-4 -mt-8 space-y-8">
      
      {/* CARD KẾT LUẬN VÙNG NÀO MỀM HƠN */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          {isASofter ? (
            <span>
              Sector <span className="text-cyan-600">{dataA.sector}</span> has{" "}
              <span className="text-emerald-600">{diffPpm} PPM LOWER</span> water hardness than Sector {dataB.sector}
            </span>
          ) : (
            <span>
              Sector <span className="text-cyan-600">{dataB.sector}</span> has{" "}
              <span className="text-emerald-600">{diffPpm} PPM LOWER</span> water hardness than Sector {dataA.sector}
            </span>
          )}
        </h2>
        <p className="text-slate-500 text-sm">
          Lower PPM indicates softer water, reduced limescale risk, and lower detergent usage.
        </p>
      </div>

      {/* BẢNG SO SÁNH TỪNG TIÊU CHÍ */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {/* HEADER BẢNG */}
        <div className="grid grid-cols-3 bg-slate-900 text-white p-4 text-sm font-bold text-center items-center">
          <div className="text-left pl-4">Water Metric</div>
          <div className="text-cyan-400 flex flex-col items-center">
            <span>Sector {dataA.sector}</span>
            <span className="text-[10px] text-slate-400 font-normal">Outcode: {dataA.outcode}</span>
          </div>
          <div className="text-cyan-400 flex flex-col items-center">
            <span>Sector {dataB.sector}</span>
            <span className="text-[10px] text-slate-400 font-normal">Outcode: {dataB.outcode}</span>
          </div>
        </div>

        {/* DÒNG CÁC CHỈ SỐ */}
        <div className="divide-y divide-slate-100">
          
          {/* 1. Average Hardness PPM */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <Droplets className="w-4 h-4 text-cyan-600 shrink-0 hidden sm:inline" />
              <span>Hardness (PPM)</span>
            </div>
            <div className="flex items-center justify-center gap-1 font-extrabold text-sm sm:text-base">
              <span className={isASofter ? "text-emerald-600" : "text-slate-700"}>
                {dataA.avgPpm} PPM
              </span>
              {isASofter && <ArrowDown className="w-4 h-4 text-emerald-600 shrink-0" />}
            </div>
            <div className="flex items-center justify-center gap-1 font-extrabold text-sm sm:text-base">
              <span className={!isASofter ? "text-emerald-600" : "text-slate-700"}>
                {dataB.avgPpm} PPM
              </span>
              {!isASofter && <ArrowDown className="w-4 h-4 text-emerald-600 shrink-0" />}
            </div>
          </div>

          {/* 2. Clark Degrees */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <Gauge className="w-4 h-4 text-cyan-600 shrink-0 hidden sm:inline" />
              <span>Clark Degrees</span>
            </div>
            <div className="font-extrabold text-sm sm:text-base text-slate-800">
              {dataA.clarkDegrees} °Clark
            </div>
            <div className="font-extrabold text-sm sm:text-base text-slate-800">
              {dataB.clarkDegrees} °Clark
            </div>
          </div>

          {/* 3. Hardness Classification */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <ShieldAlert className="w-4 h-4 text-cyan-600 shrink-0 hidden sm:inline" />
              <span>Classification</span>
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                {dataA.hardnessCategory}
              </span>
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                {dataB.hardnessCategory}
              </span>
            </div>
          </div>

          {/* 4. Bosch Dishwasher Salt Setting */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <WashingMachine className="w-4 h-4 text-cyan-600 shrink-0 hidden sm:inline" />
              <span>Bosch Salt Setting</span>
            </div>
            <div className="font-extrabold text-xs sm:text-sm text-cyan-700">
              {dataA.boschSaltSetting || "H00"}
            </div>
            <div className="font-extrabold text-xs sm:text-sm text-cyan-700">
              {dataB.boschSaltSetting || "H00"}
            </div>
          </div>

          {/* 5. Water Supplier Company */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <Building2 className="w-4 h-4 text-cyan-600 shrink-0 hidden sm:inline" />
              <span>Water Supplier</span>
            </div>
            <div className="font-medium text-xs sm:text-sm text-slate-700">
              {dataA.companyName}
            </div>
            <div className="font-medium text-xs sm:text-sm text-slate-700">
              {dataB.companyName}
            </div>
          </div>

          {/* 6. Postcodes Covered */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <Layers className="w-4 h-4 text-cyan-600 shrink-0 hidden sm:inline" />
              <span>Postcodes Covered</span>
            </div>
            <div className="font-medium text-xs sm:text-sm text-slate-600">
              {dataA.postcodeCount} postcodes
            </div>
            <div className="font-medium text-xs sm:text-sm text-slate-600">
              {dataB.postcodeCount} postcodes
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}