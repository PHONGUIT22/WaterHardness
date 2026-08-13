import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility gộp Tailwind CSS classes an toàn (Chuẩn shadcn/ui)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Hàm chuẩn hóa Slug cho URL trên toàn hệ thống
 * Xử lý sạch dấu chấm, nháy đơn, khoảng trắng thừa: "Dŵr Cymru" -> "dwr-cymru"
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Chuyển đổi Postcode Sector thành dạng URL Slug
 * Ví dụ: "AB10 1" -> "ab10-1"
 */
export function sectorToSlug(sector: string): string {
  if (!sector) return "";
  return sector.trim().toLowerCase().replace(/\s+/g, "-");
}

/**
 * Chuyển đổi URL Slug thành dạng Postcode Sector chuẩn Database
 * Ví dụ: "ab10-1" -> "AB10 1"
 */
export function slugToSector(slug: string): string {
  if (!slug) return "";
  return slug.trim().replace(/-/g, " ").toUpperCase();
}