import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { MapPin, ArrowRight, Droplets } from "lucide-react";

interface Props {
  currentSector: string;
  outcode: string;
}

export default async function RelatedSectors({ currentSector, outcode }: Props) {
  const cleanOutcode = outcode.trim().toUpperCase();
  const cleanSector = currentSector.trim().toUpperCase();

  const { data: related, error } = await supabase
    .from("water_hardness_sectors")
    .select("sector, outcode, avg_ppm, hardness_category")
    .ilike("outcode", cleanOutcode)
    .neq("sector", cleanSector)
    .order("sector", { ascending: true })
    .limit(8);

  if (error || !related || related.length === 0) return null;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyan-600" /> Other Postcode Sectors in {cleanOutcode}
        </h3>
        <p className="text-slate-500 text-xs mt-1">
          Explore water hardness and limescale risks in neighbouring areas within {cleanOutcode}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {related.map((item) => {
          const outcodeSlug = item.outcode.toLowerCase().trim();
          const sectorSlug = item.sector.toLowerCase().trim().replace(/\s+/g, "-");
          const ppm = Number(item.avg_ppm) || 0;

          return (
            /* 👉 DÙNG LINK ĐỦ 2 CẤP: /water-hardness/ba13/ba13-3 */
            <Link
              key={item.sector}
              href={`/water-hardness/${outcodeSlug}/${sectorSlug}`}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-cyan-50/60 border border-slate-200/60 hover:border-cyan-300 transition-all flex items-center justify-between group"
            >
              <div className="min-w-0 pr-2">
                <span className="font-bold text-slate-900 group-hover:text-cyan-700 text-xs block truncate">
                  Sector {item.sector}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium truncate">
                  <Droplets className="w-3 h-3 text-cyan-600 shrink-0" />
                  {ppm} PPM ({item.hardness_category})
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-cyan-600 shrink-0 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}