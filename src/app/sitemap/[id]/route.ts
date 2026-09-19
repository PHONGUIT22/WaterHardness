import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";
import { getAllOutcodesFromDB } from "@/lib/data";
import { getSeoDates } from "@/lib/seoDates";
import { guidesData } from "@/lib/guidesData";

export const revalidate = 86400; // ISR Cache 1 ngày trên CDN

const baseUrl = 'https://waterhardness.uk';
const CHUNK_SIZE = 500; // Quy định cố định 500 URLs cho mỗi sitemap con

// Khai báo sẵn các file Sitemap con để Next.js pre-build
export async function generateStaticParams() {
  const params = [
    { id: 'static.xml' },
    { id: 'outcodes.xml' },
    { id: 'compare.xml' },
    { id: 'guides.xml' },
  ];

  // Pre-build sẵn 20 file sitemap sectors (sectors-1.xml đến sectors-20.xml)
  for (let i = 1; i <= 20; i++) {
    params.push({ id: `sectors-${i}.xml` });
  }

  return params;
}

const escapeXml = (unsafe: string) => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

function buildXmlSitemap(routes: Array<{ url: string; lastModified: string; changeFrequency?: string; priority?: number }>) {
  const xmlEntries = routes.map(r => `
    <url>
      <loc>${escapeXml(r.url)}</loc>
      <lastmod>${r.lastModified}</lastmod>
      <changefreq>${r.changeFrequency || 'weekly'}</changefreq>
      <priority>${r.priority || 0.7}</priority>
    </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`.trim();
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cleanId = id.replace('.xml', ''); 
  
  let routes: Array<{ url: string; lastModified: string; changeFrequency?: string; priority?: number }> = [];

  // 1. SITEMAP CÁC TRANG TĨNH & TRUST
  if (cleanId === 'static') {
    routes = [
      '', '/outcodes', '/about', '/contact', '/privacy', '/terms'
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      // Lấy ISO trực tiếp từ getSeoDates để trùng với trang bài viết
      lastModified: getSeoDates(route || 'homepage').dateModifiedISO, 
      changeFrequency: 'monthly',
      priority: route === '' ? 1.0 : 0.6,
    }));
  }

  // 2. SITEMAP OUTCODE HUBS (~3,000 Outcodes)
  else if (cleanId === 'outcodes') {
    const outcodes = await getAllOutcodesFromDB();
    routes = outcodes.map((st) => ({
      url: `${baseUrl}/water-hardness/${st.outcode.toLowerCase()}`,
      // 👉 TRÙNG KHỚP 100% VỚI Schema JSON-LD TRONG TRANG OUTCODE
      lastModified: getSeoDates(st.outcode).dateModifiedISO,
      changeFrequency: 'weekly',
      priority: 0.9,
    }));
  }

  // 3. SITEMAP CÁC CẶP SO SÁNH HOT
  else if (cleanId === 'compare') {
    const popularPairs = [
      "sw1a-1-vs-m1-1",
      "sw1a-1-vs-b1-1",
      "sw1a-1-vs-eh1-1",
      "b1-1-vs-m1-1",
      "ab10-1-vs-sw1a-1",
      "ls1-1-vs-sw1a-1",
      "bs1-1-vs-m1-1",
    ];

    routes = popularPairs.map((pair) => ({
      url: `${baseUrl}/compare/${pair}`,
      // 👉 TRÙNG KHỚP 100% VỚI Schema JSON-LD TRONG TRANG SO SÁNH
      lastModified: getSeoDates(pair).dateModifiedISO,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  }

  // 4. SITEMAP CHI TIẾT TỪNG TRANG SECTOR (500 URLs / FILE)
  else if (cleanId.startsWith('sectors-')) {
    const pageIndex = parseInt(cleanId.replace('sectors-', ''), 10);

    if (!isNaN(pageIndex) && pageIndex > 0) {
      const from = (pageIndex - 1) * CHUNK_SIZE;
      const to = pageIndex * CHUNK_SIZE - 1;

      const { data: sectors } = await supabase
        .from("water_hardness_sectors")
        .select("sector, outcode")
        .order("sector", { ascending: true })
        .range(from, to);

      if (sectors && sectors.length > 0) {
        routes = sectors.map((s) => {
          const outcodeSlug = s.outcode.toLowerCase().trim();
          const sectorSlug = s.sector.toLowerCase().trim().replace(/\s+/g, '-');
          
          return {
            url: `${baseUrl}/water-hardness/${outcodeSlug}/${sectorSlug}`,
            // 👉 TRÙNG KHỚP 100% VỚI dateModifiedISO TRONG Schema JSON-LD CỦA TRANG SECTOR
            lastModified: getSeoDates(s.sector).dateModifiedISO, 
            changeFrequency: 'monthly',
            priority: 0.8,
          };
        });
      }
    }
  }

  // 5. SITEMAP GUIDES & BLOG HUBS (E-E-A-T Editorial Hub)
  else if (cleanId === 'guides') {
    routes = [
      {
        url: `${baseUrl}/guides`,
        lastModified: getSeoDates('guides-hub').dateModifiedISO,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      ...guidesData.map((guide) => ({
        url: `${baseUrl}/guides/${guide.slug}`,
        lastModified: guide.dateModified,
        changeFrequency: 'weekly',
        priority: 0.9,
      }))
    ];
  }

  if (routes.length === 0) {
    return new NextResponse('Sitemap Not Found', { status: 404 });
  }

  const xml = buildXmlSitemap(routes);
  
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' 
    }
  });
}