import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        // ==========================================
        // 🚀 TỐI ƯU CRAWL BUDGET CHO PSEO (40.000+ URL)
        // ==========================================
        '/*_rsc=*',          // Chặn Googlebot cào các request prefetch dữ liệu ngầm (RSC) của Next.js
        '/*?_rsc=*',         // Chặn triệt để biến thể chứa token _rsc gây tốn tài nguyên
        
        // ==========================================
        // 🔒 CHẶN HỆ THỐNG NỘI BỘ (NẾU CÓ CẤP PHÁT)
        // ==========================================
        '/api/',             // Chặn bot cào trực tiếp các endpoint API nội bộ
      ],
    },
    sitemap: 'https://waterhardness.uk/sitemap.xml',
  }
}