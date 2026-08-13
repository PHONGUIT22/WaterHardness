import Link from "next/link";
import { ShieldCheck, Database, Award, ArrowLeft, CheckCircle2, UserCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-cyan-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Hero Header */}
        <div className="mb-12 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full text-xs font-bold text-cyan-800 mb-4">
            <ShieldCheck className="w-4 h-4 text-cyan-600" /> Transparency & Accuracy First
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase mb-4">
            About WaterHardness.uk
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            WaterHardness.uk is an independent environmental data platform providing hyper-local water hardness analytics, limescale risk metrics, and appliance calibration guides across 1.7+ million UK postcodes.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Award className="w-6 h-6 text-cyan-600" /> Our Mission
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Over 60% of the UK receives hard to very hard water. Limescale build-up reduces heating efficiency, shortens boiler lifespans, increases energy bills, and damages dishwashers if salt settings are incorrectly calibrated.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Official water company reports are often hidden inside technical 50-page PDFs. Our mission is to eliminate guesswork by providing instant, postcode-precise water hardness metrics (PPM, Clark Degrees) and actionable appliance setup guides for every UK household.
          </p>
        </div>

        {/* Data Methodology */}
        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Database className="w-6 h-6 text-cyan-600" /> Data Methodology & Primary Sources
            </h2>
            <p className="text-slate-600 text-sm">
              We aggregate, clean, and standardize water quality datasets from official UK regulatory bodies and regional water suppliers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" /> Drinking Water Inspectorate (DWI)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Data parameters are benchmarked against compliance standards established by the DWI, the official regulator for public water supplies in England and Wales.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" /> Regional Water Suppliers
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Water quality metrics are sourced directly from public annual disclosures by Thames Water, Severn Trent, Anglian Water, Scottish Water, Welsh Water (Dŵr Cymru), and regional suppliers.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" /> Water Supply Zone (WSZ) Mapping
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Postcode sectors are mapped to specific Water Supply Zones (WSZ) rather than broad local council boundaries to ensure maximum geographic precision.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" /> Appliance Salt Settings Matrix
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                PPM and Clark degree readings are converted into exact dishwasher water softener settings for major brands including Bosch, Beko, Miele, and Siemens.
              </p>
            </div>
          </div>
        </div>

        {/* AUTHOR & FOUNDER SECTION (EEAT BOOST) */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-lg mb-12 border border-slate-800">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <UserCircle className="w-6 h-6 text-cyan-400" /> Meet the Founder
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 bg-cyan-600 rounded-full flex items-center justify-center text-3xl font-black shrink-0 border-4 border-slate-800 text-white">
              NP
            </div>
            <div>
              <h3 className="text-xl font-bold text-cyan-400 mb-1">Nguyễn Hạc Phong</h3>
              <p className="text-sm text-slate-400 mb-4 font-medium uppercase tracking-wider">Founder & Data Engineer</p>
              <p className="text-slate-300 leading-relaxed text-sm mb-5">
                WaterHardness.uk was created to solve a common UK household frustration: finding reliable, postcode-exact water hardness metrics without digging through technical 50-page water company reports. As a software engineer specializing in spatial data engineering and programmatic web architecture, I consolidated datasets from over 25 UK water authorities into a single, instant lookup engine.
              </p>
              
              {/* LIÊN KẾT MẠNG XÃ HỘI CHUẨN SCHEMA EEAT */}
              <div className="flex items-center gap-3 text-xs font-bold flex-wrap">
                <a 
                  href="https://github.com/KoVN-s" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-cyan-400 transition-colors"
                >
                  GitHub
                </a>
                <span className="text-slate-700">•</span>
                <a 
                  href="https://www.linkedin.com/in/nguy%E1%BB%85n-phong-a673681b5/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-cyan-400 transition-colors"
                >
                  LinkedIn
                </a>
                <span className="text-slate-700">•</span>
                <a 
                  href="https://www.facebook.com/phong.nguyen.916206/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Facebook
                </a>
                <span className="text-slate-700">•</span>
                <a 
                  href="https://gravatar.com/quicklyimpossible45dfc1b37d" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Gravatar
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Water Quality Disclaimer */}
        <div className="bg-slate-100 border border-slate-200 p-6 rounded-2xl text-xs text-slate-600 leading-relaxed">
          <strong>Water Quality Disclaimer:</strong> WaterHardness.uk is an independent information directory. Metrics (PPM, Clark Degrees) and appliance settings are calculated for educational and planning purposes. Water chemistry may vary seasonally within supply zones. Always refer to your local water supplier or appliance manual for official technical parameters.
        </div>

      </div>
    </div>
  );
}