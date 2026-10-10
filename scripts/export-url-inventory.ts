import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

// Import project data sources using relative paths
import { guidesData } from "../src/lib/guidesData";
import { citiesData } from "../src/lib/citiesData";
import { suppliersData } from "../src/lib/suppliersData";
import { POPULAR_COMPARE_PAIRS } from "../src/lib/comparePairs";

const BASE_URL = "https://waterhardness.uk";

// 1. Helper to parse .env.local without external dotenv dependency
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

// 2. Auto-width column calculator for SheetJS
function setAutoColumnWidth(worksheet: XLSX.WorkSheet, data: any[]) {
  if (!data || data.length === 0) return;
  const colKeys = Object.keys(data[0]);
  const colWidths = colKeys.map((key) => {
    let maxLen = key.length;
    for (const row of data) {
      const valStr = row[key] !== undefined && row[key] !== null ? String(row[key]) : "";
      if (valStr.length > maxLen) {
        maxLen = valStr.length;
      }
    }
    return { wch: Math.min(Math.max(maxLen + 3, 10), 65) };
  });
  worksheet["!cols"] = colWidths;
}

async function main() {
  console.log("===============================================================");
  console.log("  WATERHARDNESS.UK - URL INVENTORY & SILO EXPORTER (EXCEL & CSV)");
  console.log("===============================================================\n");

  loadEnvLocal();

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ Warning: Supabase credentials not found in .env.local!");
  }

  const supabase = createClient(supabaseUrl || "", supabaseKey || "");

  // -------------------------------------------------------------
  // A. STATIC & CORE PAGES
  // -------------------------------------------------------------
  const staticCorePages = [
    {
      path: "/",
      name: "Homepage (UK Water Hardness Checker)",
      type: "Core Landing Page",
      notes: "Main search engine and aggregate index",
    },
    {
      path: "/about",
      name: "About & WSZ Methodology",
      type: "Information / Methodology",
      notes: "Drinking Water Inspectorate methodology and data verification",
    },
    {
      path: "/contact",
      name: "Contact Us",
      type: "Core Utility Page",
      notes: "Editorial contact and data corrections",
    },
    {
      path: "/privacy",
      name: "Privacy Policy",
      type: "Legal Compliance",
      notes: "UK GDPR compliance & cookie policy",
    },
    {
      path: "/terms",
      name: "Terms of Service",
      type: "Legal Compliance",
      notes: "Terms of use and disclaimer",
    },
    {
      path: "/outcodes",
      name: "All Outcodes Directory",
      type: "Regional Directory Hub",
      notes: "Complete directory of UK postcode districts",
    },
    {
      path: "/cities",
      name: "UK Cities Water Directory",
      type: "Regional Directory Hub",
      notes: "Index of 30 major UK metropolitan hubs",
    },
    {
      path: "/suppliers",
      name: "Water Suppliers Directory",
      type: "Supplier Directory Hub",
      notes: "Directory of UK regulated water undertakers",
    },
    {
      path: "/guides",
      name: "Editorial Guides & Blog",
      type: "Content Hub",
      notes: "Complete library of water science and appliance articles",
    },
    {
      path: "/compare",
      name: "Compare Areas Tool",
      type: "Interactive Tool",
      notes: "Side-by-side water hardness comparison tool",
    },
  ];

  // -------------------------------------------------------------
  // B. TOOLS & CALCULATORS
  // -------------------------------------------------------------
  const toolsPages = [
    {
      path: "/tools/dishwasher-salt-calculator",
      name: "Dishwasher Salt Setting Calculator",
      type: "Interactive Tool",
      notes: "Official dial calibration for Bosch, Beko, Miele, Samsung & Hotpoint",
    },
  ];

  // Combined Tools & Static dataset for Sheet 6
  const toolsAndStaticRows = [...toolsPages, ...staticCorePages].map((p) => ({
    Category: p.type.includes("Tool") ? "Tool" : "Static Core Page",
    URL: `${BASE_URL}${p.path}`,
    Path: p.path,
    Page_Type: p.type,
    Name_Title: p.name,
    Notes: p.notes,
  }));

  // -------------------------------------------------------------
  // C. GUIDES & EDITORIAL ARTICLES
  // -------------------------------------------------------------
  const guidesRows = guidesData.map((g) => ({
    Category: "Guide Article",
    URL: `${BASE_URL}/guides/${g.slug}`,
    Path: `/guides/${g.slug}`,
    Slug: g.slug,
    Title: g.metaTitle || g.title,
    Topic_Category: g.category,
    Target_Area_Outcodes: g.relatedOutcodes?.join(", ") || "UK Wide",
    Date_Published: g.datePublished,
    Date_Modified: g.dateModified,
    Reading_Time: g.readingTime,
    PPM_Range: g.quickVerdict?.ppmRange || "N/A",
    Hardness_Classification: g.quickVerdict?.classification || "N/A",
  }));

  // -------------------------------------------------------------
  // D. CITIES HUBS
  // -------------------------------------------------------------
  const citiesRows = citiesData.map((c) => ({
    Category: "City Hub",
    URL: `${BASE_URL}/cities/${c.slug}`,
    Path: `/cities/${c.slug}`,
    City_Name: c.name,
    Slug: c.slug,
    Region: c.region,
    Water_Supplier: c.supplier,
    Avg_PPM: c.avgPpm,
    Clark_Degrees: c.clarkDegrees,
    Hardness_Category: c.hardnessCategory,
    Outcode_Prefixes: c.outcodePrefixes.join(", "),
    Related_Guide_Slug: c.relatedGuideSlug || "None",
  }));

  // -------------------------------------------------------------
  // E. WATER SUPPLIERS
  // -------------------------------------------------------------
  const suppliersRows = suppliersData.map((s) => ({
    Category: "Water Supplier",
    URL: `${BASE_URL}/suppliers/${s.slug}`,
    Path: `/suppliers/${s.slug}`,
    Supplier_Name: s.name,
    Slug: s.slug,
    Region_Served: s.region,
    Hardness_Category: s.hardnessCategory,
    Typical_PPM_Range: s.typicalPpmRange,
    Water_Source: s.waterSource,
    Water_Source_Type: s.waterSourceType,
    Major_Cities: s.majorCities.join(", "),
  }));

  // -------------------------------------------------------------
  // F. POPULAR COMPARE PAIRS
  // -------------------------------------------------------------
  const comparePairsRows = (POPULAR_COMPARE_PAIRS as readonly string[]).map((pair) => {
    const parts = pair.split("-vs-");
    const area1 = parts[0] ? parts[0].toUpperCase() : "";
    const area2 = parts[1] ? parts[1].toUpperCase() : "";
    return {
      Category: "Compare Pair",
      URL: `${BASE_URL}/compare/${pair}`,
      Path: `/compare/${pair}`,
      Pair_Slug: pair,
      Area_1: area1,
      Area_2: area2,
      Notes: "High-intent indexed metropolitan comparison pair",
    };
  });

  // -------------------------------------------------------------
  // G. OUTCODES (pSEO REGIONAL HUBS VIA SUPABASE PAGINATION)
  // -------------------------------------------------------------
  console.log("Fetching outcodes from database...");
  let allOutcodeRecords: any[] = [];
  let page = 0;
  const pageSize = 1000;

  try {
    while (true) {
      const { data, error } = await supabase
        .from("water_hardness_outcodes_summary")
        .select("outcode, company_name, sector_count, avg_ppm, avg_clark_degrees")
        .order("outcode", { ascending: true })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (error) {
        console.warn(`Query error on page ${page}:`, error.message);
        break;
      }

      if (!data || data.length === 0) break;
      allOutcodeRecords = allOutcodeRecords.concat(data);
      if (data.length < pageSize) break;
      page++;
    }
  } catch (err: any) {
    console.error("Failed to query outcodes summary view:", err.message);
  }

  // Fallback to raw sectors table if view is empty or failed
  if (allOutcodeRecords.length === 0) {
    console.log("Falling back to water_hardness_sectors table...");
    try {
      let sectorPage = 0;
      let rawSectors: any[] = [];
      while (true) {
        const { data, error } = await supabase
          .from("water_hardness_sectors")
          .select("outcode, company_name, avg_ppm, clark_degrees")
          .range(sectorPage * pageSize, (sectorPage + 1) * pageSize - 1);

        if (error || !data || data.length === 0) break;
        rawSectors = rawSectors.concat(data);
        if (data.length < pageSize) break;
        sectorPage++;
      }

      const outcodeMap = new Map<string, { company: string; count: number; totalPpm: number; totalClark: number }>();
      rawSectors.forEach((r) => {
        const code = (r.outcode || "").toUpperCase();
        if (!code) return;
        const ppm = Number(r.avg_ppm) || 200;
        const clark = Number(r.clark_degrees) || ppm * 0.07;
        const existing = outcodeMap.get(code);
        if (existing) {
          existing.count += 1;
          existing.totalPpm += ppm;
          existing.totalClark += clark;
        } else {
          outcodeMap.set(code, {
            company: r.company_name || "Regional Water Utility",
            count: 1,
            totalPpm: ppm,
            totalClark: clark,
          });
        }
      });

      allOutcodeRecords = Array.from(outcodeMap.entries())
        .map(([outcode, val]) => ({
          outcode,
          company_name: val.company,
          sector_count: val.count,
          avg_ppm: Math.round(val.totalPpm / val.count),
          avg_clark_degrees: Number((val.totalClark / val.count).toFixed(1)),
        }))
        .sort((a, b) => a.outcode.localeCompare(b.outcode));
    } catch (fallbackErr: any) {
      console.error("Fallback query failed:", fallbackErr.message);
    }
  }

  const outcodesRows = allOutcodeRecords.map((o) => ({
    Category: "Outcode Regional Hub",
    URL: `${BASE_URL}/water-hardness/${o.outcode.toLowerCase()}`,
    Path: `/water-hardness/${o.outcode.toLowerCase()}`,
    Outcode: o.outcode.toUpperCase(),
    Company_Name: o.company_name || "Regional Water Utility",
    Avg_PPM: Math.round(Number(o.avg_ppm)) || 200,
    Avg_Clark_Degrees: Number(o.avg_clark_degrees) || Number(((Number(o.avg_ppm) || 200) * 0.07).toFixed(1)),
    Sector_Count: Number(o.sector_count) || 1,
  }));

  // -------------------------------------------------------------
  // H. MASTER UNIFIED ALL URLS DATASET
  // -------------------------------------------------------------
  const masterAllRows: any[] = [];

  // 1. Static & Core Pages
  staticCorePages.forEach((p) => {
    masterAllRows.push({
      Category: "Static & Core Pages",
      URL: `${BASE_URL}${p.path}`,
      Path: p.path,
      Identifier: p.path.replace(/\//g, "") || "home",
      Name_Title: p.name,
      PPM: "N/A",
      Notes: p.notes,
    });
  });

  // 2. Tools
  toolsPages.forEach((t) => {
    masterAllRows.push({
      Category: "Tools & Calculators",
      URL: `${BASE_URL}${t.path}`,
      Path: t.path,
      Identifier: "dishwasher-salt-calculator",
      Name_Title: t.name,
      PPM: "N/A",
      Notes: t.notes,
    });
  });

  // 3. Guides
  guidesData.forEach((g) => {
    masterAllRows.push({
      Category: "Guides & Articles",
      URL: `${BASE_URL}/guides/${g.slug}`,
      Path: `/guides/${g.slug}`,
      Identifier: g.slug,
      Name_Title: g.metaTitle || g.title,
      PPM: g.quickVerdict?.ppmRange || "N/A",
      Notes: `${g.category} • Target: ${g.relatedOutcodes?.join(", ") || "General"}`,
    });
  });

  // 4. Cities
  citiesData.forEach((c) => {
    masterAllRows.push({
      Category: "City Hubs",
      URL: `${BASE_URL}/cities/${c.slug}`,
      Path: `/cities/${c.slug}`,
      Identifier: c.slug,
      Name_Title: `${c.name} Water Hardness Hub`,
      PPM: String(c.avgPpm),
      Notes: `${c.hardnessCategory} • Supplier: ${c.supplier}`,
    });
  });

  // 5. Suppliers
  suppliersData.forEach((s) => {
    masterAllRows.push({
      Category: "Water Suppliers",
      URL: `${BASE_URL}/suppliers/${s.slug}`,
      Path: `/suppliers/${s.slug}`,
      Identifier: s.slug,
      Name_Title: `${s.name} Regional Profile`,
      PPM: s.typicalPpmRange,
      Notes: `${s.region} • ${s.hardnessCategory}`,
    });
  });

  // 6. Compare Pairs
  (POPULAR_COMPARE_PAIRS as readonly string[]).forEach((pair) => {
    masterAllRows.push({
      Category: "Compare Pairs",
      URL: `${BASE_URL}/compare/${pair}`,
      Path: `/compare/${pair}`,
      Identifier: pair,
      Name_Title: `Compare ${pair.toUpperCase().replace(/-/g, " ")}`,
      PPM: "Comparison",
      Notes: "High-intent whitelisted comparison page",
    });
  });

  // 7. Outcodes
  outcodesRows.forEach((o) => {
    masterAllRows.push({
      Category: "Outcode Regional Hubs",
      URL: o.URL,
      Path: o.Path,
      Identifier: o.Outcode,
      Name_Title: `Water Hardness in Outcode ${o.Outcode}`,
      PPM: String(o.Avg_PPM),
      Notes: `Supplier: ${o.Company_Name} • Sectors: ${o.Sector_Count}`,
    });
  });

  // -------------------------------------------------------------
  // I. OVERVIEW SUMMARY SHEET
  // -------------------------------------------------------------
  const overviewRows = [
    {
      Category: "Static & Core Pages",
      URL_Count: staticCorePages.length,
      Sample_URL: `${BASE_URL}/about`,
      Description: "Core landing pages, legal notices, and directory hubs",
    },
    {
      Category: "Tools & Calculators",
      URL_Count: toolsPages.length,
      Sample_URL: `${BASE_URL}/tools/dishwasher-salt-calculator`,
      Description: "Interactive micro-tools and manufacturer appliance calculators",
    },
    {
      Category: "Guides & Editorial Articles",
      URL_Count: guidesRows.length,
      Sample_URL: `${BASE_URL}/guides/does-bristol-have-hard-water`,
      Description: "In-depth regional guides, geological reviews, and appliance advice",
    },
    {
      Category: "UK City Hubs",
      URL_Count: citiesRows.length,
      Sample_URL: `${BASE_URL}/cities/london`,
      Description: "High-intent regional pillar hubs covering major UK cities",
    },
    {
      Category: "Water Suppliers",
      URL_Count: suppliersRows.length,
      Sample_URL: `${BASE_URL}/suppliers/thames-water`,
      Description: "Profiles of UK regulated municipal water undertakers",
    },
    {
      Category: "Comparison Pairs",
      URL_Count: comparePairsRows.length,
      Sample_URL: `${BASE_URL}/compare/sw1a-1-vs-m1-1`,
      Description: "High-intent indexed comparisons between UK metropolitan hubs",
    },
    {
      Category: "Outcode Regional Hubs (pSEO)",
      URL_Count: outcodesRows.length,
      Sample_URL: `${BASE_URL}/water-hardness/sw1a`,
      Description: "Programmatic SEO landing pages covering UK postcode districts",
    },
    {
      Category: "TOTAL SYSTEM URLS",
      URL_Count: masterAllRows.length,
      Sample_URL: `${BASE_URL}`,
      Description: "Complete URL inventory across all architectural silos",
    },
  ];

  // -------------------------------------------------------------
  // J. EXCEL WORKBOOK GENERATION (SheetJS)
  // -------------------------------------------------------------
  const workbook = XLSX.utils.book_new();

  const sheetsConfig = [
    { name: "0_Overview", data: overviewRows },
    { name: "1_Master_All_URLs", data: masterAllRows },
    { name: "2_Guides", data: guidesRows },
    { name: "3_Cities", data: citiesRows },
    { name: "4_Outcodes", data: outcodesRows },
    { name: "5_Suppliers", data: suppliersRows },
    { name: "6_Tools_and_Static", data: toolsAndStaticRows },
    { name: "7_Compare_Pairs", data: comparePairsRows },
  ];

  for (const item of sheetsConfig) {
    const ws = XLSX.utils.json_to_sheet(item.data);
    setAutoColumnWidth(ws, item.data);
    XLSX.utils.book_append_sheet(workbook, ws, item.name);
  }

  const excelFilePath = path.resolve(process.cwd(), "url-inventory-waterhardness-uk.xlsx");
  XLSX.writeFile(workbook, excelFilePath);
  const excelStats = fs.statSync(excelFilePath);

  // -------------------------------------------------------------
  // K. CSV INDIVIDUAL EXPORTS
  // -------------------------------------------------------------
  const csvDir = path.resolve(process.cwd(), "exports", "csv");
  if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir, { recursive: true });
  }

  const csvExports = [
    { filename: "master_all_urls.csv", sheetName: "1_Master_All_URLs" },
    { filename: "guides_urls.csv", sheetName: "2_Guides" },
    { filename: "cities_urls.csv", sheetName: "3_Cities" },
    { filename: "outcodes_urls.csv", sheetName: "4_Outcodes" },
    { filename: "suppliers_urls.csv", sheetName: "5_Suppliers" },
    { filename: "tools_and_static_urls.csv", sheetName: "6_Tools_and_Static" },
    { filename: "compare_pairs_urls.csv", sheetName: "7_Compare_Pairs" },
  ];

  for (const csvItem of csvExports) {
    const sheet = workbook.Sheets[csvItem.sheetName];
    if (sheet) {
      const csvContent = XLSX.utils.sheet_to_csv(sheet);
      const csvFilePath = path.join(csvDir, csvItem.filename);
      fs.writeFileSync(csvFilePath, csvContent, "utf-8");
    }
  }

  // -------------------------------------------------------------
  // L. CONSOLE REPORTING & SUMMARY
  // -------------------------------------------------------------
  console.log("---------------------------------------------------------------");
  console.log("                    URL INVENTORY BREAKDOWN                    ");
  console.log("---------------------------------------------------------------");
  console.log(`📁 Static & Core Pages:       ${staticCorePages.length.toLocaleString().padStart(6)} URLs`);
  console.log(`📁 Tools & Calculators:       ${toolsPages.length.toLocaleString().padStart(6)} URLs`);
  console.log(`📁 Guides & Editorial Hub:    ${guidesRows.length.toLocaleString().padStart(6)} URLs`);
  console.log(`📁 UK City Hubs:              ${citiesRows.length.toLocaleString().padStart(6)} URLs`);
  console.log(`📁 Regulated Water Suppliers: ${suppliersRows.length.toLocaleString().padStart(6)} URLs`);
  console.log(`📁 Compare Pairs:             ${comparePairsRows.length.toLocaleString().padStart(6)} URLs`);
  console.log(`📁 Outcode Regional Hubs:     ${outcodesRows.length.toLocaleString().padStart(6)} URLs`);
  console.log("---------------------------------------------------------------");
  console.log(`🌟 TOTAL SYSTEM INVENTORY:     ${masterAllRows.length.toLocaleString().padStart(6)} URLs`);
  console.log("---------------------------------------------------------------\n");

  console.log(`✅ Excel Workbook Saved: ${excelFilePath}`);
  console.log(`   File Size: ${(excelStats.size / 1024).toFixed(2)} KB`);
  console.log(`✅ CSV Directory Created: ${csvDir}`);
  csvExports.forEach((c) => {
    const filePath = path.join(csvDir, c.filename);
    const size = fs.existsSync(filePath) ? (fs.statSync(filePath).size / 1024).toFixed(2) : "0";
    console.log(`   - ${c.filename.padEnd(26)} (${size} KB)`);
  });

  console.log("\n🚀 Export completed successfully!");
}

main().catch((err) => {
  console.error("FATAL ERROR in export script:", err);
  process.exit(1);
});
