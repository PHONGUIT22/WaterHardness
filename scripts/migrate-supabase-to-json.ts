import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

function getHardnessCategory(ppm: number): string {
  if (ppm < 100) return "Soft Water";
  if (ppm < 200) return "Moderately Hard";
  if (ppm < 300) return "Hard Water";
  return "Very Hard Water";
}

export interface SectorItem {
  sector: string;
  outcode: string;
  latitude: number | null;
  longitude: number | null;
  postcodeCount: number;
  companyName: string;
  avgPpm: number;
  clarkDegrees: number;
  hardnessCategory: string;
  boschSaltSetting: string;
  dataPrecision: string;
}

export interface OutcodeSummaryItem {
  outcode: string;
  company_name: string;
  avg_ppm: number;
  avg_clark_degrees: number;
  sector_count: number;
  hardness_category: string;
}

async function main() {
  console.log("===============================================================");
  console.log("  MIGRATE SUPABASE SECTORS & OUTCODES TO LOCAL JSON REPOSITORY ");
  console.log("===============================================================\n");

  loadEnvLocal();

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials not found in .env.local!");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Fetching all rows from 'water_hardness_sectors' via pagination...");

  let allSectors: any[] = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const fromIndex = page * pageSize;
    const toIndex = (page + 1) * pageSize - 1;

    console.log(`- Fetching rows ${fromIndex} to ${toIndex}...`);
    const { data, error } = await supabase
      .from("water_hardness_sectors")
      .select("*")
      .order("sector", { ascending: true })
      .range(fromIndex, toIndex);

    if (error) {
      throw new Error(`Error fetching page ${page}: ${error.message}`);
    }

    if (!data || data.length === 0) {
      break;
    }

    allSectors = allSectors.concat(data);

    if (data.length < pageSize) {
      break;
    }

    page++;
  }

  console.log(`\nTotal rows retrieved: ${allSectors.length}`);

  // Assert minimum expected rows
  if (allSectors.length < 11200) {
    throw new Error(
      `Expected at least 11,200 rows, but only received ${allSectors.length} rows!`
    );
  }

  // 1. Group sectors by outcode and build sectorsLookup
  const byOutcode: Record<string, SectorItem[]> = {};
  const bySectorSlug: Record<string, SectorItem> = {};

  for (const row of allSectors) {
    const rawOutcode = (row.outcode || "").trim().toUpperCase();
    const rawSector = (row.sector || "").trim().toUpperCase();
    const sectorSlug = rawSector.toLowerCase().replace(/\s+/g, "-");

    const sectorItem: SectorItem = {
      sector: rawSector,
      outcode: rawOutcode,
      latitude: row.latitude ? Number(row.latitude) : null,
      longitude: row.longitude ? Number(row.longitude) : null,
      postcodeCount: Number(row.postcode_count) || 0,
      companyName: row.company_name || "Regional Water Utility",
      avgPpm: Number(row.avg_ppm) || 0,
      clarkDegrees: Number(row.clark_degrees) || 0,
      hardnessCategory: row.hardness_category || getHardnessCategory(Number(row.avg_ppm) || 0),
      boschSaltSetting: row.bosch_salt_setting || "Level 2 / H02",
      dataPrecision: row.data_precision || "regional_estimate",
    };

    if (!byOutcode[rawOutcode]) {
      byOutcode[rawOutcode] = [];
    }
    byOutcode[rawOutcode].push(sectorItem);

    bySectorSlug[sectorSlug] = sectorItem;
  }

  // Sort sectors in each outcode by sector name
  for (const outcode of Object.keys(byOutcode)) {
    byOutcode[outcode].sort((a, b) => a.sector.localeCompare(b.sector));
  }

  const sectorsLookup = {
    byOutcode,
    bySectorSlug,
  };

  // 2. Generate outcodes-summary.json
  const outcodeSummaryList: OutcodeSummaryItem[] = [];

  for (const [outcode, sectors] of Object.entries(byOutcode)) {
    const sectorCount = sectors.length;
    const totalPpm = sectors.reduce((sum, s) => sum + s.avgPpm, 0);
    const avgPpm = Math.round((totalPpm / sectorCount) * 10) / 10;
    const avgClark = Math.round((avgPpm * 0.07) * 10) / 10;
    const companyName = sectors[0]?.companyName || "Regional Water Utility";
    const hardnessCategory = getHardnessCategory(avgPpm);

    outcodeSummaryList.push({
      outcode,
      company_name: companyName,
      avg_ppm: avgPpm,
      avg_clark_degrees: avgClark,
      sector_count: sectorCount,
      hardness_category: hardnessCategory,
    });
  }

  // Sort alphabetically by outcode
  outcodeSummaryList.sort((a, b) =>
    a.outcode.localeCompare(b.outcode, undefined, { numeric: true, sensitivity: "base" })
  );

  // 3. Write JSON files to src/data/
  const dataDir = path.resolve(process.cwd(), "src", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outcodesSummaryPath = path.join(dataDir, "outcodes-summary.json");
  const sectorsLookupPath = path.join(dataDir, "sectors-lookup.json");

  console.log(`Writing ${outcodesSummaryPath}...`);
  fs.writeFileSync(outcodesSummaryPath, JSON.stringify(outcodeSummaryList, null, 2), "utf-8");

  console.log(`Writing ${sectorsLookupPath}...`);
  fs.writeFileSync(sectorsLookupPath, JSON.stringify(sectorsLookup), "utf-8");

  const outcodesStat = fs.statSync(outcodesSummaryPath);
  const sectorsStat = fs.statSync(sectorsLookupPath);

  console.log("\n---------------------------------------------------------------");
  console.log("                    MIGRATION SUMMARY                          ");
  console.log("---------------------------------------------------------------");
  console.log(`✅ Total Sectors Processed:  ${allSectors.length.toLocaleString()}`);
  console.log(`✅ Total Outcodes Grouped:   ${outcodeSummaryList.length.toLocaleString()}`);
  console.log(`✅ Sectors by Slug Indexed:  ${Object.keys(bySectorSlug).length.toLocaleString()}`);
  console.log(`📁 outcodes-summary.json:    ${(outcodesStat.size / 1024).toFixed(2)} KB`);
  console.log(`📁 sectors-lookup.json:      ${(sectorsStat.size / 1024 / 1024).toFixed(2)} MB`);
  console.log("---------------------------------------------------------------\n");
  console.log("Migration completed successfully!");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
