import { getSupplierBySlug, SupplierMetadata } from "@/lib/suppliersData";
import {
  outcodesSummary,
  sectorsLookup,
  WaterSectorRecord,
} from "@/lib/sectorsLocal";

// Khai báo Type để Code TypeScript chuẩn chỉ, gợi ý code (IntelliSense) mượt mà
export interface WaterSectorData {
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

// 1. TỐI ƯU TRANG CHỦ / XẾP HẠNG: Lấy Top vùng nước Mềm nhất và Cứng nhất UK
export async function getHardnessRankings() {
  const allSectors = Object.values(sectorsLookup.bySectorSlug);

  const sorted = [...allSectors].sort((a, b) => a.avgPpm - b.avgPpm);

  const mapItem = (item: WaterSectorRecord) => ({
    sector: item.sector,
    outcode: item.outcode,
    company: item.companyName,
    ppm: item.avgPpm,
    category: item.hardnessCategory,
  });

  return {
    softest: sorted.slice(0, 5).map(mapItem),
    hardest: sorted.slice(-5).reverse().map(mapItem),
  };
}

// 2. TỐI ƯU TRANG DIRECTORY (Danh sách tất cả Outcode - VD: /outcodes)
export async function getAllOutcodesFromDB() {
  return outcodesSummary.map((row) => ({
    outcode: row.outcode,
    company: row.company_name,
    count: Number(row.sector_count) || 1,
    avgPpm: Number(row.avg_ppm) || 0,
    avgClarkDegrees: Number(row.avg_clark_degrees) || 0,
  }));
}

// 3. TỐI ƯU TRANG TRUY VẤN OUTCODE (VD: Trang tổng quan khu vực /water-hardness/AB10)
export async function getOutcodeOverviewData(outcodeStr: string) {
  const cleanOutcode = outcodeStr.trim().toUpperCase();
  const data = sectorsLookup.byOutcode[cleanOutcode];

  if (!data || data.length === 0) return null;

  // Tính chỉ số trung bình độ cứng cho cả vùng Outcode
  const totalPpm = data.reduce((sum, item) => sum + item.avgPpm, 0);
  const avgPpm = Math.round((totalPpm / data.length) * 10) / 10;

  const sectors = data.map((item) => ({
    sector: item.sector,
    postcodeCount: item.postcodeCount,
    companyName: item.companyName,
    avgPpm: item.avgPpm,
    clarkDegrees: item.clarkDegrees,
    hardnessCategory: item.hardnessCategory,
    boschSaltSetting: item.boschSaltSetting,
  }));

  // Lấy ra khu vực mềm nhất & cứng nhất trong Outcode này
  const sortedByPpm = [...sectors].sort((a, b) => a.avgPpm - b.avgPpm);

  return {
    outcode: cleanOutcode,
    companyName: data[0].companyName,
    totalSectors: data.length,
    avgPpm,
    softestSector: sortedByPpm[0],
    hardestSector: sortedByPpm[sortedByPpm.length - 1],
    sectorsList: sectors,
  };
}

// 4. TỐI ƯU TRANG CHI TIẾT 1 SECTOR (VD: /water-hardness/AB10/ab10-1)
export async function getSectorData(sectorStr: string): Promise<WaterSectorData | null> {
  const cleanSectorSlug = sectorStr.trim().toLowerCase().replace(/\s+/g, "-");
  const data = sectorsLookup.bySectorSlug[cleanSectorSlug];

  if (!data) {
    return null;
  }

  return {
    sector: data.sector,
    outcode: data.outcode,
    latitude: data.latitude,
    longitude: data.longitude,
    postcodeCount: data.postcodeCount,
    companyName: data.companyName,
    avgPpm: data.avgPpm,
    clarkDegrees: data.clarkDegrees,
    hardnessCategory: data.hardnessCategory,
    boschSaltSetting: data.boschSaltSetting,
    dataPrecision: data.dataPrecision,
  };
}

// 5. LẤY CÁC SECTOR CÙNG THUỘC MỘT OUTCODE (Adjacent / Sibling Sectors)
export async function getAdjacentSectors(outcode: string): Promise<WaterSectorData[]> {
  const clean = outcode.trim().toUpperCase();
  return sectorsLookup.byOutcode[clean] || [];
}

// 6. TỐI ƯU SO SÁNH 2 SECTOR
export async function compareTwoSectors(sector1: string, sector2: string) {
  const clean1 = sector1.trim().toLowerCase().replace(/\s+/g, "-");
  const clean2 = sector2.trim().toLowerCase().replace(/\s+/g, "-");

  const item1 = sectorsLookup.bySectorSlug[clean1];
  const item2 = sectorsLookup.bySectorSlug[clean2];

  if (!item1 && !item2) return null;

  const formatItem = (row: WaterSectorRecord) => ({
    sector: row.sector,
    outcode: row.outcode,
    companyName: row.companyName,
    avgPpm: row.avgPpm,
    clarkDegrees: row.clarkDegrees,
    hardnessCategory: row.hardnessCategory,
    boschSaltSetting: row.boschSaltSetting,
    postcodeCount: row.postcodeCount,
  });

  return {
    sector1: item1 ? formatItem(item1) : null,
    sector2: item2 ? formatItem(item2) : null,
  };
}

// 7. Lấy danh sách Top Sector để Build tĩnh (SSG)
export async function getTopSectorsForBuild() {
  const allSectors = Object.values(sectorsLookup.bySectorSlug);
  return allSectors
    .sort((a, b) => b.postcodeCount - a.postcodeCount)
    .slice(0, 300)
    .map((s) => ({
      outcode: s.outcode,
      sector: s.sector,
    }));
}

// 8. Lấy danh sách Outcode thuộc về một Thành phố dựa theo tiền tố Outcode (VD: ["SW", "SE", "E", ...])
export async function getOutcodesForCity(outcodePrefixes: string[]) {
  if (!outcodePrefixes || outcodePrefixes.length === 0) return [];
  const allOutcodes = await getAllOutcodesFromDB();
  return allOutcodes
    .filter((item) => {
      return outcodePrefixes.some((prefix) => {
        const regex = new RegExp(`^${prefix}\\d`, "i");
        return regex.test(item.outcode);
      });
    })
    .sort((a, b) =>
      a.outcode.localeCompare(b.outcode, undefined, { numeric: true, sensitivity: "base" })
    );
}

// 9. TỐI ƯU TRANG WATER SUPPLIER HUB (VD: /suppliers/thames-water)
export interface SupplierOutcodeItem {
  outcode: string;
  avgPpm: number;
  clarkDegrees: number;
  hardnessCategory: string;
  sectorCount: number;
}

export interface SupplierOverviewResult {
  supplier: SupplierMetadata;
  totalSectors: number;
  totalOutcodes: number;
  networkAvgPpm: number;
  networkClarkDegrees: number;
  hardnessCategory: string;
  softestOutcode: SupplierOutcodeItem;
  hardestOutcode: SupplierOutcodeItem;
  topHardestOutcodes: SupplierOutcodeItem[];
  topSoftestOutcodes: SupplierOutcodeItem[];
  outcodes: SupplierOutcodeItem[];
}

export async function getSupplierOverview(supplierSlug: string): Promise<SupplierOverviewResult | null> {
  const supplier = getSupplierBySlug(supplierSlug);
  if (!supplier) return null;

  const pattern = supplier.dbPattern.replace(/%/g, "").toLowerCase();
  const allSectors = Object.values(sectorsLookup.bySectorSlug);
  const data = allSectors.filter((s) => s.companyName.toLowerCase().includes(pattern));

  if (!data || data.length === 0) return null;

  const totalPpm = data.reduce((sum, item) => sum + item.avgPpm, 0);
  const networkAvgPpm = Math.round((totalPpm / data.length) * 10) / 10;
  const networkClarkDegrees = Math.round(networkAvgPpm * 0.07 * 10) / 10;

  // Group by outcode
  const outcodeMap = new Map<string, { outcode: string; totalPpm: number; count: number; category: string }>();
  data.forEach((row) => {
    const code = row.outcode.toUpperCase();
    const existing = outcodeMap.get(code);
    const ppm = row.avgPpm;
    if (existing) {
      existing.totalPpm += ppm;
      existing.count += 1;
    } else {
      outcodeMap.set(code, {
        outcode: code,
        totalPpm: ppm,
        count: 1,
        category: row.hardnessCategory || "Hard",
      });
    }
  });

  const outcodeList: SupplierOutcodeItem[] = Array.from(outcodeMap.values()).map((o) => {
    const avg = Math.round((o.totalPpm / o.count) * 10) / 10;
    return {
      outcode: o.outcode,
      avgPpm: avg,
      clarkDegrees: Math.round(avg * 0.07 * 10) / 10,
      hardnessCategory:
        avg < 100
          ? "Soft"
          : avg < 150
          ? "Moderately Soft"
          : avg < 200
          ? "Slightly Hard"
          : avg < 300
          ? "Hard"
          : "Very Hard",
      sectorCount: o.count,
    };
  });

  const sortedByPpm = [...outcodeList].sort((a, b) => a.avgPpm - b.avgPpm);
  const sortedByCode = [...outcodeList].sort((a, b) =>
    a.outcode.localeCompare(b.outcode, undefined, { numeric: true, sensitivity: "base" })
  );

  const softest = sortedByPpm[0];
  const hardest = sortedByPpm[sortedByPpm.length - 1];

  const hardnessCategory =
    networkAvgPpm < 100
      ? "Soft Water"
      : networkAvgPpm < 150
      ? "Moderately Soft"
      : networkAvgPpm < 200
      ? "Moderately Hard"
      : networkAvgPpm < 300
      ? "Hard Water"
      : "Very Hard Water";

  return {
    supplier,
    totalSectors: data.length,
    totalOutcodes: outcodeList.length,
    networkAvgPpm,
    networkClarkDegrees,
    hardnessCategory,
    softestOutcode: softest,
    hardestOutcode: hardest,
    topSoftestOutcodes: sortedByPpm.slice(0, 6),
    topHardestOutcodes: [...sortedByPpm].reverse().slice(0, 6),
    outcodes: sortedByCode,
  };
}