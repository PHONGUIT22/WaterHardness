"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Droplets,
  Flame,
  Filter,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
  Phone,
  Home,
  Clock,
  Wrench,
  Shield,
  ShoppingCart,
  ExternalLink
} from "lucide-react";

interface QuoteRequestCardProps {
  outcode: string;
  avgPpm: number;
  locationName?: string;
}

export default function QuoteRequestCard({
  outcode,
  avgPpm,
  locationName = "your area",
}: QuoteRequestCardProps) {
  const isHardWater = avgPpm >= 180;
  const isModerateWater = avgPpm >= 100 && avgPpm < 180;
  const isSoftWater = avgPpm < 100;

  const [softTab, setSoftTab] = useState<"direct_solutions" | "installer_quote">("direct_solutions");

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [serviceNeeded, setServiceNeeded] = useState(
    isSoftWater ? "drinking_filter" : "water_softener"
  );
  const [propertyType, setPropertyType] = useState("detached");
  const [urgency, setUrgency] = useState("within_month");

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcode,
          city_or_town: locationName,
          ppm_reading: avgPpm,
          service_needed: serviceNeeded,
          property_type: propertyType,
          urgency,
          full_name: fullName,
          phone_number: phoneNumber,
          email,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to register request. Please check your details.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="my-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 sm:p-8 text-center shadow-sm">
        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          Quote Request Successfully Matched!
        </h3>
        <p className="mt-2 text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
          Thank you, <strong>{fullName}</strong>. We have matched your request for <strong>{outcode}</strong> ({avgPpm} PPM) with vetted local water and heating engineers in <strong>{locationName}</strong>. You will receive up to 3 competitive, no-obligation quotes shortly.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-white px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Verified Against British Standard BS 7593 Code of Practice
        </div>
      </div>
    );
  }

  return (
    <section className="my-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/50 p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Local Installer Quote Network
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {isHardWater
            ? `Living in a Hard Water Zone (${outcode} averages ${avgPpm} PPM)? Compare Approved Local Installers`
            : isModerateWater
            ? `Protect Your Heating & Appliances in ${outcode} (${avgPpm} PPM): Compare Local Specialists`
            : `Soft Water Zone Detected (${outcode} averages ${avgPpm} PPM): Pure Water Solutions`}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          {isHardWater
            ? `Get up to 3 free, no-obligation quotes from WRAS-approved water softener installers and heating engineers serving ${locationName}.`
            : isModerateWater
            ? `Connect with certified local plumbers for limescale management and British Standard BS 7593 heating system protection in ${locationName}.`
            : `Because your water is naturally soft, you do not need an expensive salt softener (£1,200+). Explore DIY drinking water filters or compare local specialists for boiler care.`}
        </p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 py-3 px-4 bg-white/90 rounded-xl border border-slate-200/80 text-xs text-slate-700 font-medium">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Verified Against British Standard BS 7593</span>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{isSoftWater ? "WRAS-Approved Filtration Systems" : "WRAS-Approved Water Softeners"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{isSoftWater ? "Direct DIY or Free Local Quotes" : "100% Free & No Obligation Quotes"}</span>
        </div>
      </div>

      {/* Soft Water Reassurance Banner */}
      {isSoftWater && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm text-emerald-950">
            <p className="font-bold">
              Good News: Your Water in {outcode} is Naturally Soft ({avgPpm} PPM) — You Don&apos;t Need an Expensive Salt Softener!
            </p>
            <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
              Unlike hard water regions, you won&apos;t suffer from rapid limescale buildup. However, many residents in {locationName} install targeted under-sink filters for chlorine and microplastics, or schedule British Standard BS 7593 anti-corrosion heating maintenance.
            </p>
          </div>
        </div>
      )}

      {/* Dual Tab Switcher for Soft Water */}
      {isSoftWater && (
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          <button
            type="button"
            onClick={() => setSoftTab("direct_solutions")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              softTab === "direct_solutions"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Direct Buy Solutions (No Plumber Needed)
          </button>
          <button
            type="button"
            onClick={() => setSoftTab("installer_quote")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              softTab === "installer_quote"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Wrench className="w-4 h-4" />
            Request Plumber Quotes (Under-sink / Boiler Maintenance)
          </button>
        </div>
      )}

      {/* Soft Water Direct Solutions View */}
      {isSoftWater && softTab === "direct_solutions" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Under-Sink Activated Carbon Water Filter */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800">
                    Taste &amp; Purity
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">~£45 – £95</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">
                  Under-Sink Activated Carbon Filter
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Removes chlorine taste, odours, lead and microplastics directly at your kitchen tap while preserving healthy natural minerals.
                </p>
                <ul className="text-[11px] text-slate-600 space-y-1 mb-4">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>DIY installation in 15–20 minutes</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>No wastewater or electricity needed</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>6 to 12-month cartridge lifespan</span>
                  </li>
                </ul>
              </div>
              <a
                href="https://www.amazon.co.uk/s?k=under+sink+water+filter+drinking+water&tag=pseowater-21"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors text-center cursor-pointer"
              >
                <span>Check Amazon UK Price</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 2: Lead & Heavy Metal Inox 304 Drinking Tap */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-800">
                    Lead-Free Tap
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">~£35 – £65</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">
                  Lead-Free Inox 304 Drinking Tap
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Dedicated drinking water faucet forged from food-grade 304 stainless steel, preventing heavy metal leaching from older pipework.
                </p>
                <ul className="text-[11px] text-slate-600 space-y-1 mb-4">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>100% lead-free SUS 304 stainless steel</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Drip-free ceramic disc valve cartridge</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Standard 1/4&quot; push-fit pipe compatibility</span>
                  </li>
                </ul>
              </div>
              <a
                href="https://www.amazon.co.uk/s?k=lead+free+drinking+water+tap+304+stainless+steel&tag=pseowater-21"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors text-center cursor-pointer"
              >
                <span>Check Amazon UK Price</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 3: KDF-55 Shower Filter */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800">
                    Skin &amp; Hair Care
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">~£25 – £40</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">
                  KDF-55 Shower Chlorine Filter
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Neutralises harsh municipal chlorine and heavy metals that trigger dry itchy skin, scalp irritation, and eczema in soft water areas.
                </p>
                <ul className="text-[11px] text-slate-600 space-y-1 mb-4">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>KDF-55 + Calcium Sulfite media</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Universal 1/2&quot; thread screws onto any shower</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Maintains full water flow and pressure</span>
                  </li>
                </ul>
              </div>
              <a
                href="https://www.amazon.co.uk/s?k=kdf-55+shower+filter+chlorine+uk&tag=pseowater-21"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors text-center cursor-pointer"
              >
                <span>Check Amazon UK Price</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="pt-2 text-center">
            <p className="text-xs text-slate-500">
              Prefer professional installation or boiler protection in {locationName}?{" "}
              <button
                type="button"
                onClick={() => setSoftTab("installer_quote")}
                className="text-blue-600 font-bold underline hover:text-blue-800 cursor-pointer"
              >
                Switch to Installer Quotes
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Step 1 Form */}
      {(!isSoftWater || softTab === "installer_quote") && step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. What service do you need in {outcode}?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {!isSoftWater && (
                <button
                  type="button"
                  onClick={() => setServiceNeeded("water_softener")}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all relative ${
                    serviceNeeded === "water_softener"
                      ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20 shadow-xs"
                      : isHardWater
                      ? "border-blue-300 bg-white hover:bg-blue-50/50 text-slate-800 ring-1 ring-blue-200"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                  }`}
                >
                  <Droplets className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-sm font-bold">Whole-House Water Softener</div>
                      {isHardWater && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-600 text-white shadow-2xs">
                          ★ Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Harvey, Kinetico, EcoWater compatible (£1,200–£2,500)
                    </div>
                  </div>
                </button>
              )}

              <button
                type="button"
                onClick={() => setServiceNeeded("boiler_protection")}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  serviceNeeded === "boiler_protection"
                    ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                }`}
              >
                <Flame className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="text-sm font-bold">Boiler Descaling &amp; Protection</div>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {isSoftWater
                      ? "BS 7593 Anti-corrosion flush & inhibitor (£350–£600)"
                      : "BS 7593 Power flush & scale protection (£350–£600)"}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setServiceNeeded("drinking_filter")}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  serviceNeeded === "drinking_filter"
                    ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20 shadow-xs"
                    : isSoftWater
                    ? "border-cyan-300 bg-white hover:bg-cyan-50/50 text-slate-800 ring-1 ring-cyan-200"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                }`}
              >
                <Filter className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="text-sm font-bold">Drinking Water Filtration</div>
                    {isSoftWater && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-cyan-600 text-white shadow-2xs">
                        ★ Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Under-sink Reverse Osmosis / Carbon block filter
                  </div>
                </div>
              </button>

              {!isSoftWater && (
                <button
                  type="button"
                  onClick={() => setServiceNeeded("both")}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    serviceNeeded === "both"
                      ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                  }`}
                >
                  <Wrench className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold">Complete Package</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Water Softener + BS 7593 Boiler Care Package
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Property Type & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-slate-500" /> Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="detached">Detached House (3–5 Bedrooms)</option>
                <option value="semi_detached">Semi-Detached House</option>
                <option value="terraced">Terraced Property</option>
                <option value="flat_apartment">Flat / Apartment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Timeframe
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="asap">As soon as possible</option>
                <option value="within_month">Within the next month</option>
                <option value="planning_budget">Just researching / budgeting</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue to Local Quotes <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 2 Form */}
      {(!isSoftWater || softTab === "installer_quote") && step === 2 && (
        <form onSubmit={handleFinalSubmit} className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
            <span className="text-xs font-bold uppercase text-slate-600">
              2. Contact Details for Certified {outcode} Engineers
            </span>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              &larr; Back to services
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. David Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-500" /> UK Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 07123 456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Used solely by certified installers to deliver your quote.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. david.smith@example.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Postal District (Outcode)
              </label>
              <input
                type="text"
                readOnly
                disabled
                value={outcode}
                className="w-full p-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-bold"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...
                </>
              ) : (
                <>
                  Request Free Quotes <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-500">
              🔒 100% Free. No spam. Data protected under UK GDPR.
            </span>
          </div>
        </form>
      )}
    </section>
  );
}
