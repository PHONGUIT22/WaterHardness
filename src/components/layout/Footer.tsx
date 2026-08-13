import Link from "next/link";
import { ShieldCheck, Droplet } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Cột 1: Thông tin Thương hiệu & Mô tả */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white tracking-tight inline-block">
              <Droplet className="w-5 h-5 text-cyan-400 fill-cyan-400" />
              <span>
                WaterHardness<span className="text-cyan-400">.uk</span>
              </span>
            </Link>
            <p className="mt-4 text-xs leading-relaxed max-w-sm text-slate-400">
              WaterHardness.uk provides hyper-local UK water hardness analytics (PPM & Clark degrees), limescale risk assessments, and appliance dishwasher salt setting guides (Bosch, Beko, Miele) across England, Scotland, Wales, and Northern Ireland.
            </p>
          </div>

          {/* Cột 2: Legal & Trust (Giữ nguyên chuẩn AdSense & E-E-A-T) */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Legal & Trust</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us & Methodology</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Cột 3: SEO Internal Links - Các vùng trọng điểm UK */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Top Regions</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/compare" className="hover:text-white transition-colors">Compare Postcodes Tool</Link></li>
              <li><Link href="/water-hardness/sw1a" className="hover:text-white transition-colors">London Water Hardness</Link></li>
              <li><Link href="/water-hardness/b1" className="hover:text-white transition-colors">Birmingham Water Quality</Link></li>
              <li><Link href="/water-hardness/m1" className="hover:text-white transition-colors">Manchester Water Hardness</Link></li>
              <li><Link href="/outcodes" className="hover:text-white transition-colors">All UK Outcodes Directory</Link></li>
            </ul>
          </div>

        </div>

        {/* BẮT BUỘC: DÒNG MIỄN TRỪ TRÁCH NHIỆM VÀ NGUỒN DỮ LIỆU UK */}
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 mb-8 leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong>Disclaimer:</strong> WaterHardness.uk is an independent information service. Water hardness metrics (PPM, Clark Degrees) are compiled from public disclosures by the Drinking Water Inspectorate (DWI) and regional UK water suppliers (including Thames Water, Severn Trent, Scottish Water, etc.). Appliance salt settings are provided for general reference—always consult your manufacturer manual.
          </div>
        </div>

        {/* Bản quyền */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WaterHardness.uk. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Updated for 2026 Data Cycle</p>
        </div>

      </div>
    </footer>
  );
}