import { supabase } from "@/lib/supabase";
import { citiesData } from "@/lib/citiesData";
import { suppliersData, findSupplierByName } from "@/lib/suppliersData";

/**
 * Hàm phân tích câu Search và tự động chuyển hướng đúng URL SEO cho nước Anh (UK)
 */
export async function resolveSearchDestination(query: string): Promise<string> {
  const clean = query.trim();
  if (!clean) return "/outcodes";

  const lower = clean.toLowerCase();

  // 1. TRƯỜNG HỢP TOOLS & CALCULATORS
  if (lower.includes("salt") || lower.includes("dishwasher")) {
    return "/tools/dishwasher-salt-calculator";
  }
  if (lower === "compare" || lower.includes("compare area") || lower.includes("compare water")) {
    return "/compare";
  }

  // 2. TRƯỜNG HỢP CITIES: Kiểm tra City trong citiesData
  const matchedCity =
    citiesData.find(
      (c) => c.name.toLowerCase() === lower || c.slug.toLowerCase() === lower
    ) ||
    citiesData.find(
      (c) =>
        lower.length >= 3 &&
        (c.name.toLowerCase().startsWith(lower) || lower.startsWith(c.name.toLowerCase()))
    );
  if (matchedCity) {
    return `/cities/${matchedCity.slug}`;
  }

  // 3. TRƯỜNG HỢP SUPPLIERS: Kiểm tra Nhà cung cấp nước trong suppliersData
  const matchedSupplier =
    suppliersData.find(
      (s) => s.name.toLowerCase() === lower || s.slug.toLowerCase() === lower
    ) || findSupplierByName(clean);
  if (matchedSupplier) {
    return `/suppliers/${matchedSupplier.slug}`;
  }

  // 4. TRƯỜNG HỢP POSTCODE SECTORS & OUTCODES
  // Chuẩn hóa chuỗi tìm kiếm (VD: "sw1a-1" hoặc "sw1a 1" -> "SW1A 1")
  const normalizedQuery = clean.replace(/-/g, " ").toUpperCase();
  const outcodeQuery = clean.replace(/\s+/g, "").toUpperCase();

  // 4.1. User nhập đầy đủ Postcode Sector (VD: "SW1A 1", "AB10 1", "ab10-1")
  const { data: sectorMatch } = await supabase
    .from("water_hardness_sectors")
    .select("sector, outcode")
    .ilike("sector", normalizedQuery)
    .limit(1)
    .maybeSingle();

  if (sectorMatch) {
    const outcodeClean = sectorMatch.outcode.toLowerCase();
    const sectorSlug = sectorMatch.sector.toLowerCase().replace(/\s+/g, "-");
    return `/water-hardness/${outcodeClean}/${sectorSlug}`;
  }

  // 4.2. User chỉ nhập Outcode (VD: "SW1A", "AB10", "M1", "B1")
  const { data: outcodeMatch } = await supabase
    .from("water_hardness_sectors")
    .select("outcode")
    .ilike("outcode", outcodeQuery)
    .limit(1)
    .maybeSingle();

  if (outcodeMatch) {
    return `/water-hardness/${outcodeMatch.outcode.toLowerCase()}`;
  }

  // 4.3. Tìm kiếm tương đối (Gõ thiếu hoặc tìm kiếm gần đúng)
  const { data: partialMatches } = await supabase
    .from("water_hardness_sectors")
    .select("sector, outcode")
    .or(`sector.ilike.%${normalizedQuery}%,outcode.ilike.%${outcodeQuery}%`)
    .limit(1);

  if (partialMatches && partialMatches.length > 0) {
    const match = partialMatches[0];
    const outcodeClean = match.outcode.toLowerCase();
    const sectorSlug = match.sector.toLowerCase().replace(/\s+/g, "-");
    return `/water-hardness/${outcodeClean}/${sectorSlug}`;
  }

  // 4.4. FALLBACK AN TOÀN: Nếu không tìm thấy gì thì về trang danh mục Outcodes
  return "/outcodes";
}