export interface SeoDatesResult {
  datePublishedISO: string;
  dateModifiedISO: string;
  datePublishedFormatted: string; // Dùng hiển thị giao diện UI chuẩn UK (VD: "12 March 2025")
  dateModifiedFormatted: string;  // Dùng hiển thị giao diện UI chuẩn UK (VD: "14 August 2026")
  seed: number;
}

/**
 * Hàm phát sinh ngày Published & Modified tất định dựa trên Sector, Outcode hoặc URL Slug.
 * Giúp Google Bot ghi nhận tín hiệu nội dung tươi mới (Freshness Signal) chuẩn định dạng UK.
 */
export function getSeoDates(input: string | number | object): SeoDatesResult {
  const strInput = typeof input === "string" ? input : JSON.stringify(input);

  // Thuật toán FNV-1a Hash tạo seed phân bổ đều dựa trên Sector/Outcode/Slug
  let hash = 2166136261;
  for (let i = 0; i < strInput.length; i++) {
    hash ^= strInput.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const seed = Math.abs(hash);

  const ONE_DAY_MS = 86400000;

  // Mốc bắt đầu dự án: 01/01/2025
  const baseStart = new Date("2025-01-01T08:00:00Z").getTime();

  // Mốc trần tối đa: Tháng 8/2026 (2026-08-20)
  const maxCapTime = new Date("2026-08-20T18:00:00Z").getTime();

  // Dàn trải ngày Publish ngẫu nhiên từ Tháng 1/2025 đến Tháng 5/2026 (~500 ngày)
  const publishDaysAdded = seed % 500;
  const randomHour = seed % 24;
  const randomMinute = (seed * 11) % 60;
  const randomSecond = (seed * 17) % 60;

  let publishTime =
    baseStart +
    publishDaysAdded * ONE_DAY_MS +
    randomHour * 3600000 +
    randomMinute * 60000 +
    randomSecond * 1000;

  if (publishTime > maxCapTime) {
    publishTime = maxCapTime - (seed % 30) * ONE_DAY_MS;
  }

  const publishDate = new Date(publishTime);

  // Ngày Modified: Cộng thêm từ 15 đến 90 ngày sau Publish (Chốt cập nhật vào đợt T8/2026)
  const modifiedDaysAdded = (seed % 75) + 15;
  let modifiedTime = publishTime + modifiedDaysAdded * ONE_DAY_MS;

  // Giới hạn modifiedDate không được vượt quá Tháng 8/2026
  if (modifiedTime > maxCapTime) {
    modifiedTime = maxCapTime - (seed % 5) * ONE_DAY_MS;
  }

  const modifiedDate = new Date(modifiedTime);

  // Format ISO 8601 cho Schema.org (Google Search Console)
  const formatISO = (date: Date) => date.toISOString();

  // Format chuẩn UK cho giao diện UI người Anh (VD: "14 August 2026")
  const formatUI = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return {
    datePublishedISO: formatISO(publishDate),
    dateModifiedISO: formatISO(modifiedDate),
    datePublishedFormatted: formatUI(publishDate),
    dateModifiedFormatted: formatUI(modifiedDate),
    seed,
  };
}