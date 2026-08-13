import { supabase } from "@/lib/supabase";

/**
 * Hàm phân tích câu Search và tự động chuyển hướng đúng URL SEO cho nước Anh (UK)
 */
export async function resolveSearchDestination(query: string): Promise<string> {
  const clean = query.trim();
  if (!clean) return "/outcodes";

  // Chuẩn hóa chuỗi tìm kiếm (VD: "sw1a-1" hoặc "sw1a 1" -> "SW1A 1")
  const normalizedQuery = clean.replace(/-/g, " ").toUpperCase();
  const outcodeQuery = clean.replace(/\s+/g, "").toUpperCase();

  // 1. TRƯỜNG HỢP 1: User nhập đầy đủ Postcode Sector (VD: "SW1A 1", "AB10 1", "ab10-1")
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

  // 2. TRƯỜNG HỢP 2: User chỉ nhập Outcode (VD: "SW1A", "AB10", "M1", "B1")
  const { data: outcodeMatch } = await supabase
    .from("water_hardness_sectors")
    .select("outcode")
    .ilike("outcode", outcodeQuery)
    .limit(1)
    .maybeSingle();

  if (outcodeMatch) {
    return `/water-hardness/${outcodeMatch.outcode.toLowerCase()}`;
  }

  // 3. TRƯỜNG HỢP 3: Tìm kiếm tương đối (Gõ thiếu hoặc tìm kiếm gần đúng)
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

  // 4. FALLBACK AN TOÀN: Nếu không tìm thấy gì thì về trang danh mục Outcodes (Không crash app)
  return "/outcodes";
}