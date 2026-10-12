import outcodesSummaryJson from "@/data/outcodes-summary.json";
import sectorsLookupJson from "@/data/sectors-lookup.json";

export interface WaterSectorRecord {
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

export interface OutcodeSummaryRecord {
  outcode: string;
  company_name: string;
  avg_ppm: number;
  avg_clark_degrees: number;
  sector_count: number;
  hardness_category: string;
}

export interface SectorsLookupData {
  byOutcode: Record<string, WaterSectorRecord[]>;
  bySectorSlug: Record<string, WaterSectorRecord>;
}

export const outcodesSummary = outcodesSummaryJson as unknown as OutcodeSummaryRecord[];
export const sectorsLookup = sectorsLookupJson as unknown as SectorsLookupData;
