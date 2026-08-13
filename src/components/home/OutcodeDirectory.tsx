import Link from "next/link";
import { MapPin } from "lucide-react";
import { getAllOutcodesFromDB } from "@/lib/data";

export default async function OutcodeDirectory() {
  const outcodes = await getAllOutcodesFromDB();

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center justify-center sm:justify-start gap-2">
          <MapPin className="w-7 h-7 text-blue-500" /> Outcode Directory ({outcodes.length} Regions)
        </h2>
        <p className="text-slate-600 mt-2 text-sm">
          Browse water hardness data across all UK postal areas.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {outcodes.map((item) => (
          <Link
            key={item.outcode}
            href={`/water-hardness/${item.outcode.toLowerCase()}`}
            className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-500 hover:shadow-sm transition-all flex items-center justify-between group"
          >
            <div className="truncate pr-2">
              <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors text-sm block">
                {item.outcode}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                {item.company}
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-500 uppercase bg-slate-100 group-hover:bg-blue-50 px-2 py-0.5 rounded transition-colors shrink-0">
              {item.count} Sectors
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}