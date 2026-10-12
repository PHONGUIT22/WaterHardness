import { NextResponse } from "next/server";
import { outcodesSummary, sectorsLookup } from "@/lib/sectorsLocal";
import { citiesData, getCityByOutcode } from "@/lib/citiesData";
import { suppliersData } from "@/lib/suppliersData";

export const dynamic = "force-dynamic";

export interface SearchSuggestCity {
  name: string;
  slug: string;
  region: string;
  avgPpm: number;
  url: string;
}

export interface SearchSuggestSupplier {
  name: string;
  slug: string;
  region: string;
  url: string;
}

export interface SearchSuggestOutcode {
  outcode: string;
  avgPpm: number;
  companyName: string;
  cityName?: string;
  url: string;
}

export interface SearchSuggestSector {
  sector: string;
  outcode: string;
  avgPpm: number;
  hardnessCategory?: string;
  companyName?: string;
  url: string;
}

export interface SearchSuggestTool {
  title: string;
  description: string;
  url: string;
  badge: string;
}

export interface SearchSuggestResponse {
  query: string;
  cities: SearchSuggestCity[];
  suppliers: SearchSuggestSupplier[];
  outcodes: SearchSuggestOutcode[];
  sectors: SearchSuggestSector[];
  tools: SearchSuggestTool[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = (searchParams.get("q") || searchParams.get("query") || "").trim();

    if (!rawQuery || rawQuery.length < 1) {
      return NextResponse.json(
        {
          query: "",
          cities: [],
          suppliers: [],
          outcodes: [],
          sectors: [],
          tools: [],
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
          },
        }
      );
    }

    const cleanLower = rawQuery.toLowerCase();
    const cleanUpper = rawQuery.toUpperCase().replace(/\s+/g, " ");
    const outcodePattern = cleanUpper.replace(/\s+/g, "");

    // 1. IN-MEMORY MATCH: Tools & Calculators
    const tools: SearchSuggestTool[] = [];
    if (
      cleanLower.includes("salt") ||
      cleanLower.includes("dish") ||
      cleanLower.includes("calc") ||
      cleanLower.includes("machine") ||
      cleanLower.includes("dial") ||
      cleanLower.includes("setting")
    ) {
      tools.push({
        title: "Dishwasher Salt Setting Calculator",
        description: "Official dial calibration for Bosch, Beko, Miele & Samsung",
        url: "/tools/dishwasher-salt-calculator",
        badge: "Tool",
      });
    }

    if (
      cleanLower.includes("compare") ||
      cleanLower.includes("vs") ||
      cleanLower.includes("diff")
    ) {
      tools.push({
        title: "Compare Water Hardness Tool",
        description: "Compare PPM ratings between multiple UK towns & outcodes",
        url: "/compare",
        badge: "Tool",
      });
    }

    // 2. IN-MEMORY MATCH: Cities
    const matchedCities: SearchSuggestCity[] = citiesData
      .filter((city) => {
        const name = city.name.toLowerCase();
        const slug = city.slug.toLowerCase();
        const region = city.region.toLowerCase();
        return (
          name.startsWith(cleanLower) ||
          slug.startsWith(cleanLower) ||
          name.includes(cleanLower) ||
          region.includes(cleanLower)
        );
      })
      .slice(0, 4)
      .map((c) => ({
        name: c.name,
        slug: c.slug,
        region: c.region,
        avgPpm: c.avgPpm,
        url: `/cities/${c.slug}`,
      }));

    // 3. IN-MEMORY MATCH: Water Suppliers
    const matchedSuppliers: SearchSuggestSupplier[] = suppliersData
      .filter((s) => {
        const name = s.name.toLowerCase();
        const slug = s.slug.toLowerCase();
        const region = s.region.toLowerCase();
        return (
          name.startsWith(cleanLower) ||
          name.includes(cleanLower) ||
          slug.includes(cleanLower) ||
          region.includes(cleanLower)
        );
      })
      .slice(0, 3)
      .map((s) => ({
        name: s.name,
        slug: s.slug,
        region: s.region,
        url: `/suppliers/${s.slug}`,
      }));

    // 4. LOCAL IN-MEMORY MATCH: Outcodes & Sectors
    const hasSpaceOrSectorDigit = /\s|\d$/.test(rawQuery);

    const matchedOutcodeRows = outcodesSummary
      .filter((o) => o.outcode.toUpperCase().startsWith(outcodePattern))
      .slice(0, 6);

    const outcodes: SearchSuggestOutcode[] = matchedOutcodeRows.map((row) => {
      const city = getCityByOutcode(row.outcode);
      return {
        outcode: row.outcode,
        avgPpm: Number(row.avg_ppm) || 200,
        companyName: row.company_name || "Regional Water Utility",
        cityName: city ? city.name : undefined,
        url: `/water-hardness/${row.outcode.toLowerCase()}`,
      };
    });

    const sectors: SearchSuggestSector[] = [];
    if (hasSpaceOrSectorDigit) {
      const allSectors = Object.values(sectorsLookup.bySectorSlug);
      for (const s of allSectors) {
        if (s.sector.toUpperCase().startsWith(cleanUpper)) {
          sectors.push({
            sector: s.sector,
            outcode: s.outcode,
            avgPpm: Number(s.avgPpm) || 200,
            hardnessCategory: s.hardnessCategory || "Hard Water",
            companyName: s.companyName,
            url: `/water-hardness/${s.outcode.toLowerCase()}/${s.sector
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
          });
          if (sectors.length >= 4) break;
        }
      }
    }

    return NextResponse.json(
      {
        query: rawQuery,
        cities: matchedCities,
        suppliers: matchedSuppliers,
        outcodes,
        sectors,
        tools,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
        },
      }
    );
  } catch (err: any) {
    console.error("Search suggest error:", err);
    return NextResponse.json(
      {
        query: "",
        cities: [],
        suppliers: [],
        outcodes: [],
        sectors: [],
        tools: [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60",
        },
      }
    );
  }
}
