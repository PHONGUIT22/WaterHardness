import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-cyan-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-8 pb-6 border-b border-slate-200">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-2">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500">Effective Date: January 1, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-6 leading-relaxed">
          
          <p>
            Welcome to <strong>WaterHardness.uk</strong>! By accessing or using our website located at https://waterhardness.uk, you agree to comply with and be bound by the following Terms of Service.
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">1. Informational & Educational Disclaimer</h2>
          <p className="bg-cyan-50 p-4 rounded-xl border border-cyan-200 text-cyan-950">
            <strong>Disclaimer:</strong> All water hardness metrics (PPM, Clark Degrees), limescale risk estimates, and appliance salt settings (Bosch, Beko, Miele, etc.) published on WaterHardness.uk are provided solely for general informational and educational purposes. They do not replace official technical specifications from appliance manufacturers or local water undertakers. Always consult your appliance user manual before adjusting water softener settings.
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">2. Use of Content & Intellectual Property</h2>
          <p>
            The content, structure, database layout, and visual elements of WaterHardness.uk are protected by intellectual property laws. You may access our tools for personal, non-commercial use. Automated scraping or commercial redistribution of our aggregated datasets without written permission is strictly prohibited.
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">3. Data Sources & Accuracy</h2>
          <p>
            While we strive to keep our data updated using official UK public sources (including the Drinking Water Inspectorate - DWI, Thames Water, Severn Trent, Scottish Water, and regional suppliers), WaterHardness.uk makes no warranties regarding real-time chemical variations or seasonal water source shifts within Water Supply Zones (WSZ).
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">4. Limitation of Liability</h2>
          <p>
            In no event shall WaterHardness.uk or its operators be liable for any direct, indirect, incidental, or consequential damages (including appliance malfunction or plumbing issues) resulting from the use or reliance on our calculations or guides.
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the site after changes are posted constitutes acceptance of the modified Terms of Service.
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">6. Contact Information</h2>
          <p>
            For questions regarding these Terms, please contact us at <strong>support@waterhardness.uk</strong>.
          </p>

        </div>

      </div>
    </div>
  );
}