import { Metadata } from "next";
import Link from "next/link";
import { getAllOutcodesFromDB } from "@/lib/data";
import { Building2, ArrowRight, ShieldCheck } from "lucide-react";

export const revalidate = 86400; // Cache CDN 24h

export const metadata: Metadata = {
  title: "All UK Outcodes: Water Hardness Directory",
  description: "Browse water hardness levels, PPM readings, and appliance settings for all UK outcode areas.",
  alternates: {
    canonical: "https://waterhardness.uk/outcodes",
  },
};

export default async function OutcodesDirectoryPage() {
  const outcodes = await getAllOutcodesFromDB();

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20">
      {/* HERO HEADER */}
      <section className="bg-slate-900 text-white pt-16 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-slate-800 text-cyan-400 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" /> Full UK Directory • 2026
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase">
            All UK <span className="text-cyan-400">Outcodes</span>
          </h1>
          <p className="text-slate-400 mt-3 text-base sm:text-lg max-w-2xl">
            Select an outcode area below to view local water hardness (PPM), water supply zone details, and dishwasher salt settings.
          </p>
        </div>
      </section>

      {/* DIRECTORY GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-cyan-600" /> Outcode Directory ({outcodes.length} Areas)
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {outcodes.map((item) => (
              <Link
                key={item.outcode}
                href={`/water-hardness/${item.outcode.toLowerCase()}`}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-cyan-50 border border-slate-200/60 hover:border-cyan-300 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-slate-900 group-hover:text-cyan-700 text-sm block">
                    {item.outcode}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {item.count} Sectors
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-cyan-600 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}