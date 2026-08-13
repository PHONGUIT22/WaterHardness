"use client";

import { useState } from "react";
import { 
  Droplets, 
  WashingMachine, 
  AlertTriangle, 
  CheckCircle2, 
  ShoppingBag, 
  Zap, 
  ShieldAlert, 
  ExternalLink,
  Flame,
  Info
} from "lucide-react";

interface ApplianceSetupProps {
  sector: string;
  avgPpm: number;
  clarkDegrees: number;
  hardnessCategory: string;
  boschSaltSetting: string;
  companyName: string;
}

const BRANDS = [
  { id: "bosch", name: "Bosch / Siemens", logo: "Bosch" },
  { id: "beko", name: "Beko", logo: "Beko" },
  { id: "miele", name: "Miele", logo: "Miele" },
  { id: "whirlpool", name: "Whirlpool / Hotpoint", logo: "Whirlpool" },
];

export default function ApplianceSetupGuide({
  sector,
  avgPpm,
  clarkDegrees,
  hardnessCategory,
  boschSaltSetting,
  companyName,
}: ApplianceSetupProps) {
  const [selectedBrand, setSelectedBrand] = useState("bosch");

  // 1. TÍNH TOÁN VỊ TRÍ THANH ĐO GAUGE BAR (0 - 350 PPM)
  const gaugePercent = Math.min(Math.max((avgPpm / 350) * 100, 5), 100);

  // 2. MÀU SẮC & CẢNH BÁO THEO ĐỘ CỨNG
  const isSoft = avgPpm < 100;
  const isModerate = avgPpm >= 100 && avgPpm < 200;
  const isHard = avgPpm >= 200 && avgPpm < 300;
  const isVeryHard = avgPpm >= 300;

  const categoryColor = isSoft
    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
    : isModerate
    ? "text-amber-600 bg-amber-50 border-amber-200"
    : isHard
    ? "text-orange-600 bg-orange-50 border-orange-200"
    : "text-red-600 bg-red-50 border-red-200";

  const gaugeBarColor = isSoft
    ? "bg-emerald-500"
    : isModerate
    ? "bg-amber-500"
    : isHard
    ? "bg-orange-500"
    : "bg-red-600";

  // 3. TÍNH CÀI ĐẶT MÁY THEO THƯƠNG HIỆU
  const getBrandSaltSetting = () => {
    if (selectedBrand === "bosch") {
      return boschSaltSetting || (isSoft ? "H00 (No Salt Required)" : "H04");
    }
    if (selectedBrand === "beko") {
      if (avgPpm < 90) return "Level 1 (Soft Water)";
      if (avgPpm < 180) return "Level 2 (Medium)";
      if (avgPpm < 270) return "Level 3 (Hard Water)";
      return "Level 4 (Very Hard - Max Salt)";
    }
    if (selectedBrand === "miele") {
      if (avgPpm < 70) return "1°dH - 4°dH (Setting 1)";
      if (avgPpm < 180) return "5°dH - 10°dH (Setting 2)";
      if (avgPpm < 270) return "11°dH - 15°dH (Setting 3)";
      return "16°dH+ (Setting 4 - Max Softener)";
    }
    // Whirlpool / Hotpoint
    if (avgPpm < 100) return "1 (Soft)";
    if (avgPpm < 200) return "2 (Medium)";
    return "3 - 4 (Hard Water)";
  };

  return (
    <div className="space-y-8">
      
      {/* 1. THANH ĐO ĐỘ CỨNG GAUGE BAR (VISUAL PPM SCALE) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Water Hardness Level
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {avgPpm} <span className="text-base font-normal text-slate-500">PPM (mg/L)</span>
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              {clarkDegrees} °Clark
            </span>
            <span className={`px-4 py-1.5 rounded-full border font-bold text-xs ${categoryColor}`}>
              {hardnessCategory || (isSoft ? "Soft" : isHard ? "Hard" : "Very Hard")}
            </span>
          </div>
        </div>

        {/* Dynamic Gauge Bar */}
        <div className="space-y-2">
          <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${gaugeBarColor}`}
              style={{ width: `${gaugePercent}%` }}
            />
          </div>

          {/* Label dải đo */}
          <div className="flex justify-between text-[11px] font-bold text-slate-400 pt-1">
            <span>0 PPM (Soft)</span>
            <span>100 PPM</span>
            <span>200 PPM (Hard)</span>
            <span>300+ PPM (Very Hard)</span>
          </div>
        </div>

        {/* Thông báo tình trạng nước */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
          <div>
            Water supplied by <strong>{companyName}</strong> in <strong>{sector}</strong> is categorized as <strong>{hardnessCategory || "Standard"}</strong>. 
            {isSoft 
              ? " Limescale risk is low. Dishwasher salt is optional." 
              : " High mineral content causes rapid limescale build-up on heating elements and appliances."}
          </div>
        </div>
      </div>

      {/* 2. BỘ CHỌN THƯƠNG HIỆU MÁY RỦA BÁT & CÀI ĐẶT MUỐI (BRAND SELECTOR) */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
          <WashingMachine className="w-4 h-4" /> Dishwasher Setup Guide
        </div>
        <h3 className="text-2xl font-bold mb-2">Exact Water Softener Setting for {sector}</h3>
        <p className="text-slate-400 text-xs mb-6">
          Select your dishwasher brand to get the manufacturer-recommended salt setting for this area.
        </p>

        {/* Brand Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {BRANDS.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrand(brand.id)}
              className={`py-3 px-4 rounded-xl font-bold text-xs transition-all border ${
                selectedBrand === brand.id
                  ? "bg-cyan-600 border-cyan-500 text-white shadow-md"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>

        {/* Salt Setting Box Output */}
        <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Recommended Setting:</span>
            <span className="text-2xl font-black text-cyan-400 block mt-0.5">
              {getBrandSaltSetting()}
            </span>
          </div>

          <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 max-w-xs">
            {isSoft ? (
              <span className="text-emerald-400 font-semibold">
                ✓ No salt required or set to minimum level to save costs.
              </span>
            ) : (
              <span className="text-amber-300 font-semibold">
                ⚠️ Dishwasher salt is required to prevent cloudy glasses and internal scale buildup.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. TÁC ĐỘNG CỦA ĐỘ CỨNG ĐẾN THIẾT BỊ GIA ĐÌNH (LIMESCALE IMPACT METRICS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-3">
            <Flame className="w-5 h-5" />
          </div>
          <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Boiler Efficiency Loss</span>
          <span className="text-2xl font-black text-slate-900 block mt-1">
            {isSoft ? "0%" : isModerate ? "~5%" : isHard ? "~12%" : "~20%+"}
          </span>
          <span className="text-slate-500 text-[11px] block mt-1">Extra energy cost per year</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Limescale Formation Risk</span>
          <span className="text-2xl font-black text-slate-900 block mt-1">
            {isSoft ? "Low" : isModerate ? "Moderate" : isHard ? "High" : "Severe"}
          </span>
          <span className="text-slate-500 text-[11px] block mt-1">On taps, kettles & showers</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center mb-3">
            <Droplets className="w-5 h-5" />
          </div>
          <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Detergent Needed</span>
          <span className="text-2xl font-black text-slate-900 block mt-1">
            {isSoft ? "Standard" : isHard ? "+30% Dose" : "+50% Dose"}
          </span>
          <span className="text-slate-500 text-[11px] block mt-1">For laundry & dishwashing</span>
        </div>

      </div>

      {/* 4. PHỄU BÁN HÀNG AFFILIATE (AMAZON / AWIN HIGH CONVERSION) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider block">
              Recommended Solutions
            </span>
            <h3 className="text-xl font-bold mt-1">Protect Your Appliances in {sector}</h3>
          </div>
          <ShoppingBag className="w-8 h-8 text-cyan-400 opacity-80 shrink-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card Affiliate 1: Muối rửa bát */}
          <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-cyan-900/60 text-cyan-300 px-2.5 py-1 rounded-md inline-block mb-3">
                Essential
              </span>
              <h4 className="font-bold text-sm text-white mb-1">Dishwasher Regeneration Salt</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Prevents limescale buildup in water softeners and stops cloudy film on glassware.
              </p>
            </div>
            <a
              href="https://www.amazon.co.uk/dp/B0032AM8A0?tag=YOUR_AMAZON_TAG" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              Check Price on Amazon <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card Affiliate 2: Đầu lọc vòi sen */}
          <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-purple-900/60 text-purple-300 px-2.5 py-1 rounded-md inline-block mb-3">
                Skin & Hair Protection
              </span>
              <h4 className="font-bold text-sm text-white mb-1">Shower Head Water Filter</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Reduces chlorine & hard minerals to protect against dry skin, eczema, and hair damage.
              </p>
            </div>
            <a
              href="https://www.amazon.co.uk/s?k=shower+head+filter+hard+water&tag=YOUR_AMAZON_TAG"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-slate-700 hover:bg-cyan-600 text-white font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5"
            >
              Check Shower Filters <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card Affiliate 3: Viên tẩy cặn vôi */}
          <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-900/60 text-amber-300 px-2.5 py-1 rounded-md inline-block mb-3">
                Maintenance
              </span>
              <h4 className="font-bold text-sm text-white mb-1">Appliance Descaler Tablets</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Quickly dissolves limescale deposits inside kettles, coffee machines, and washing machines.
              </p>
            </div>
            <a
              href="https://www.amazon.co.uk/s?k=appliance+descaler+tablets&tag=YOUR_AMAZON_TAG"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-slate-700 hover:bg-cyan-600 text-white font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5"
            >
              View Descalers <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}