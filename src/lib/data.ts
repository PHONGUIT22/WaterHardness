import { supabase } from "@/lib/supabase";

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
}

// 1. TỐI ƯU TRANG CHỦ / XẾP HẠNG: Lấy Top vùng nước Mềm nhất và Cứng nhất UK
export async function getHardnessRankings() {
  const { data: softest, error: softErr } = await supabase
    .from("water_hardness_sectors")
    .select("sector, outcode, company_name, avg_ppm, hardness_category")
    .order("avg_ppm", { ascending: true })
    .limit(5);

  const { data: hardest, error: hardErr } = await supabase
    .from("water_hardness_sectors")
    .select("sector, outcode, company_name, avg_ppm, hardness_category")
    .order("avg_ppm", { ascending: false })
    .limit(5);

  if (softErr || hardErr) {
    console.error("Lỗi fetch Hardness Rankings:", softErr || hardErr);
    return { softest: [], hardest: [] };
  }

  const mapItem = (item: any) => ({
    sector: item.sector,
    outcode: item.outcode,
    company: item.company_name,
    ppm: Number(item.avg_ppm) || 0,
    category: item.hardness_category,
  });

  return {
    softest: (softest || []).map(mapItem),
    hardest: (hardest || []).map(mapItem),
  };
}

// 2. TỐI ƯU TRANG DIRECTORY (Danh sách tất cả Outcode - VD: /outcodes)
export async function getAllOutcodesFromDB() {
  const { data, error } = await supabase
    .from("water_hardness_sectors")
    .select("outcode, company_name");

  if (error || !data) {
    console.error("Lỗi fetch Directory Outcodes:", error);
    return [];
  }

  // Gom nhóm theo Outcode và đếm số lượng Sector bên trong
  const outcodeMap = new Map<string, { outcode: string; company: string; count: number }>();

  data.forEach((row) => {
    const existing = outcodeMap.get(row.outcode);
    if (existing) {
      existing.count += 1;
    } else {
      outcodeMap.set(row.outcode, {
        outcode: row.outcode,
        company: row.company_name,
        count: 1,
      });
    }
  });

  return Array.from(outcodeMap.values()).sort((a, b) => a.outcode.localeCompare(b.outcode));
}

// 3. TỐI ƯU TRANG TRUY VẤN OUTCODE (VD: Trang tổng quan khu vực /outcode/AB10)
export async function getOutcodeOverviewData(outcodeStr: string) {
  const cleanOutcode = outcodeStr.trim().toUpperCase();

  const { data, error } = await supabase
    .from("water_hardness_sectors")
    .select("*")
    .ilike("outcode", cleanOutcode)
    .order("sector", { ascending: true });

  if (error || !data || data.length === 0) return null;

  // Tính chỉ số trung bình độ cứng cho cả vùng Outcode
  const totalPpm = data.reduce((sum, item) => sum + (Number(item.avg_ppm) || 0), 0);
  const avgPpm = Math.round((totalPpm / data.length) * 10) / 10;

  const sectors = data.map((item) => ({
    sector: item.sector,
    postcodeCount: Number(item.postcode_count) || 0,
    companyName: item.company_name,
    avgPpm: Number(item.avg_ppm) || 0,
    clarkDegrees: Number(item.clark_degrees) || 0,
    hardnessCategory: item.hardness_category,
    boschSaltSetting: item.bosch_salt_setting,
  }));

  // Lấy ra khu vực mềm nhất & cứng nhất trong Outcode này
  const sortedByPpm = [...sectors].sort((a, b) => a.avgPpm - b.avgPpm);

  return {
    outcode: cleanOutcode,
    companyName: data[0].company_name,
    totalSectors: data.length,
    avgPpm,
    softestSector: sortedByPpm[0],
    hardestSector: sortedByPpm[sortedByPpm.length - 1],
    sectorsList: sectors,
  };
}

// 4. TỐI ƯU TRANG CHI TIẾT 1 SECTOR (VD: /water-hardness/AB12-3 hoặc tra cứu nhanh)
export async function getSectorData(sectorStr: string): Promise<WaterSectorData | null> {
  const cleanSector = sectorStr.trim().toUpperCase();

  const { data, error } = await supabase
    .from("water_hardness_sectors")
    .select("*")
    .ilike("sector", cleanSector)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error(`Lỗi fetch Sector ${cleanSector}:`, error);
    return null;
  }

  return {
    sector: data.sector,
    outcode: data.outcode,
    latitude: data.latitude ? Number(data.latitude) : null,
    longitude: data.longitude ? Number(data.longitude) : null,
    postcodeCount: Number(data.postcode_count) || 0,
    companyName: data.company_name,
    avgPpm: Number(data.avg_ppm) || 0,
    clarkDegrees: Number(data.clark_degrees) || 0,
    hardnessCategory: data.hardness_category,
    boschSaltSetting: data.bosch_salt_setting,
  };
}

// 5. TỐI ƯU SO SÁNH 2 SECTOR (Chỉ dùng 1 Query duy nhất bằng toán tử IN)
export async function compareTwoSectors(sector1: string, sector2: string) {
  const clean1 = sector1.trim().toUpperCase();
  const clean2 = sector2.trim().toUpperCase();

  const { data, error } = await supabase
    .from("water_hardness_sectors")
    .select("*")
    .in("sector", [clean1, clean2]);

  if (error || !data || data.length === 0) return null;

  const formatItem = (row: any) => ({
    sector: row.sector,
    outcode: row.outcode,
    companyName: row.company_name,
    avgPpm: Number(row.avg_ppm) || 0,
    clarkDegrees: Number(row.clark_degrees) || 0,
    hardnessCategory: row.hardness_category,
    boschSaltSetting: row.bosch_salt_setting,
    postcodeCount: Number(row.postcode_count) || 0,
  });

  const item1 = data.find((d) => d.sector.toUpperCase() === clean1);
  const item2 = data.find((d) => d.sector.toUpperCase() === clean2);

  return {
    sector1: item1 ? formatItem(item1) : null,
    sector2: item2 ? formatItem(item2) : null,
  };
}