import Link from "next/link";
import { Droplet, Flame } from "lucide-react";
import { getHardnessRankings } from "@/lib/data";

export default async function TopRankingGrid() {
  const { softest, hardest } = await getHardnessRankings();

  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200/60 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            UK Water Hardness Rankings
          </h2>
          <p className="text-slate-600 mt-2 text-sm">
            Top regions with the softest and hardest water, based on our real-time database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CARD 1: NƯỚC MỀM NHẤT */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Droplet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Top 5 Softest Areas</h3>
                  <p className="text-xs text-slate-500">Lowest limescale risk</p>
                </div>
              </div>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                Skin & Hair Friendly
              </span>
            </div>

            <div className="space-y-4">
              {softest.map((item, idx) => {
                const sectorSlug = item.sector.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link
                    key={item.sector}
                    href={`/water-hardness/${item.outcode.toLowerCase()}/${sectorSlug}`}
                    className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-xs font-bold text-slate-400 group-hover:text-blue-600">#{idx + 1}</span>
                      <div>
                        <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors uppercase block">
                          Sector {item.sector}
                        </span>
                        <span className="text-[10px] text-slate-500 block">{item.company}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 text-sm block">{item.ppm} PPM</span>
                      <span className="text-[11px] font-semibold text-blue-600">{item.category}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CARD 2: NƯỚC CỨNG NHẤT */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Top 5 Hardest Areas</h3>
                  <p className="text-xs text-slate-500">Highest calcium levels</p>
                </div>
              </div>
              <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                Appliance Risk
              </span>
            </div>

            <div className="space-y-4">
              {hardest.map((item, idx) => {
                const sectorSlug = item.sector.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link
                    key={item.sector}
                    href={`/water-hardness/${item.outcode.toLowerCase()}/${sectorSlug}`}
                    className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-xs font-bold text-slate-400 group-hover:text-amber-600">#{idx + 1}</span>
                      <div>
                        <span className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors uppercase block">
                          Sector {item.sector}
                        </span>
                        <span className="text-[10px] text-slate-500 block">{item.company}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 text-sm block">{item.ppm} PPM</span>
                      <span className="text-[11px] font-semibold text-amber-600">{item.category}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}