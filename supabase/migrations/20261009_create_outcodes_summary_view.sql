-- =============================================================================
-- Migration: Create `water_hardness_outcodes_summary` View
-- Purpose: Pre-aggregate 15,000+ raw sectors into ~2,800 outcode summaries
-- Prevents memory bloat and serverless timeouts on Node.js runtime
-- =============================================================================

CREATE OR REPLACE VIEW public.water_hardness_outcodes_summary AS
SELECT 
  outcode, 
  company_name, 
  COUNT(*)::integer as sector_count,
  ROUND(AVG(avg_ppm)::numeric, 1)::float as avg_ppm,
  ROUND(AVG(clark_degrees)::numeric, 1)::float as avg_clark_degrees
FROM public.water_hardness_sectors
GROUP BY outcode, company_name;

COMMENT ON VIEW public.water_hardness_outcodes_summary IS 
'Pre-aggregated outcode summary view reducing 15,000+ sectors to ~2,800 outcode rows for high-performance directory and city listing pages.';
