import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

export const revalidate = 86400; // CDN Cache 1 ngày / lần

export async function GET() {
  const baseUrl = 'https://waterhardness.uk';

  // 1. Đếm tổng số lượng Sectors trong Database để chia nhỏ Sitemap (500 URLs / file)
  const { count } = await supabase
    .from("water_hardness_sectors")
    .select("*", { count: "exact", head: true });

  const totalSectors = count || 9000;
  const CHUNK_SIZE = 500;
  const totalSectorSitemaps = Math.ceil(totalSectors / CHUNK_SIZE);

  // 2. Tạo danh sách các Sitemap con dạng: /sitemap/sectors-1.xml, /sitemap/sectors-2.xml...
  const sectorSitemapsXml = Array.from({ length: totalSectorSitemaps }, (_, i) => `
    <sitemap>
      <loc>${baseUrl}/sitemap/sectors-${i + 1}.xml</loc>
    </sitemap>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
      <loc>${baseUrl}/sitemap/static.xml</loc>
    </sitemap>
    <sitemap>
      <loc>${baseUrl}/sitemap/outcodes.xml</loc>
    </sitemap>
    <sitemap>
      <loc>${baseUrl}/sitemap/compare.xml</loc>
    </sitemap>
    ${sectorSitemapsXml}
  </sitemapindex>`.trim();

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'
    },
  });
}