import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";
import { getAllOutcodesFromDB } from "@/lib/data";
import { getSeoDates } from "@/lib/seoDates";
import { guidesData } from "@/lib/guidesData";
import { citiesData } from "@/lib/citiesData";

export const revalidate = 86400; // ISR Cache 1 ngày trên CDN

const baseUrl = 'https://waterhardness.uk';
const CHUNK_SIZE = 500; // Quy định cố định 500 URLs cho mỗi sitemap con

// Khai báo sẵn các file Sitemap con để Next.js pre-build
// Bao gồm 20 file sectors-*.xml để trả về HTTP 200 (0 URL), xóa sạch 20 lỗi 404 trong GSC
export async function generateStaticParams() {
  const sectorSitemaps = Array.from({ length: 20 }, (_, i) => ({
    id: `sectors-${i + 1}.xml`
  }));

  return [
    { id: 'static.xml' },
    { id: 'outcodes.xml' },
    { id: 'compare.xml' },
    { id: 'guides.xml' },
    { id: 'cities.xml' },
    ...sectorSitemaps
  ];
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

  // 4. SITEMAP CHI TIẾT TỪNG TRANG SECTOR (Trả về XML rỗng HTTP 200 để GSC xóa sạch 20 lỗi 404)
  else if (cleanId.startsWith('sectors-')) {
    const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>`;
    return new NextResponse(emptyXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400'
      },
    });
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

  // 6. SITEMAP CITIES HUBS (Top 30 UK Cities & Directory)
  else if (cleanId === 'cities') {
    routes = [
      {
        url: `${baseUrl}/cities`,
        lastModified: getSeoDates('cities-directory').dateModifiedISO,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      ...citiesData.map((city) => ({
        url: `${baseUrl}/cities/${city.slug}`,
        lastModified: getSeoDates(city.slug).dateModifiedISO,
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