import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCityByOutcode, getCityBySlug } from "@/lib/citiesData";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("query") || searchParams.get("outcode") || "").trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const clean = query.toUpperCase().replace(/\s+/g, " ").trim();
    // Extract outcode part (e.g. "GU21" from "GU21 4EP" or "SW1A 1AA")
    const outcodeMatch = clean.match(/^[A-Z]{1,2}[0-9][A-Z0-9]?/);
    const candidateOutcode = outcodeMatch ? outcodeMatch[0] : clean.split(" ")[0];

    // 1. Try querying the pre-aggregated outcodes summary view
    const { data: summaryData, error: summaryErr } = await supabase
      .from("water_hardness_outcodes_summary")
      .select("outcode, company_name, avg_ppm, avg_clark_degrees, sector_count")
      .ilike("outcode", candidateOutcode)
      .maybeSingle();

    if (summaryData && !summaryErr) {
      const avgPpm = Number(summaryData.avg_ppm) || 200;
      const clark = Number(summaryData.avg_clark_degrees) || Number((avgPpm * 0.07).toFixed(1));
      const city = getCityByOutcode(summaryData.outcode);

      return NextResponse.json({
        success: true,
        found: true,
        outcode: summaryData.outcode,
        avgPpm,
        clarkDegrees: clark,
        companyName: summaryData.company_name || "Regional Water Utility",
        locationName: city ? city.name : summaryData.outcode,
        source: "outcodes_summary"
      });
    }

    // 2. Try querying raw sectors table (fallback)
    const { data: sectorData } = await supabase
      .from("water_hardness_sectors")
      .select("outcode, company_name, avg_ppm, clark_degrees, hardness_category, sector")
      .or(`outcode.ilike.${candidateOutcode},sector.ilike.${clean}`)
      .limit(1)
      .maybeSingle();

    if (sectorData) {
      const avgPpm = Number(sectorData.avg_ppm) || 200;
      const clark = Number(sectorData.clark_degrees) || Number((avgPpm * 0.07).toFixed(1));
      const city = getCityByOutcode(sectorData.outcode);

      return NextResponse.json({
        success: true,
        found: true,
        outcode: sectorData.outcode,
        avgPpm,
        clarkDegrees: clark,
        companyName: sectorData.company_name || "Regional Water Utility",
        locationName: city ? city.name : sectorData.outcode,
        source: "sectors_table"
      });
    }

    // 3. Try checking major UK City hubs
    const cityMatch = getCityBySlug(query.toLowerCase()) || getCityByOutcode(candidateOutcode);
    if (cityMatch) {
      return NextResponse.json({
        success: true,
        found: true,
        outcode: candidateOutcode || cityMatch.outcodePrefixes[0],
        avgPpm: cityMatch.avgPpm,
        clarkDegrees: cityMatch.clarkDegrees,
        companyName: cityMatch.supplier,
        locationName: cityMatch.name,
        source: "city_hub"
      });
    }

    // 4. Not found in database
    return NextResponse.json({
      success: true,
      found: false,
      query: clean,
      message: "No specific water hardness records found for this postcode. You can manually adjust the PPM slider."
    });
  } catch (error: any) {
    console.error("Hardness lookup API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal lookup error" },
      { status: 500 }
    );
  }
}
