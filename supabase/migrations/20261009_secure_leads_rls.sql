-- =============================================================================
-- Migration: Secure Row Level Security (RLS) for `leads` table
-- Purpose: Revoke vulnerable public direct insert policy.
-- Ensures only verified server-side route handler (/api/leads) via service_role
-- can insert new leads, completely blocking anonymous database spam.
-- =============================================================================

-- Drop vulnerable public insert policy
DROP POLICY IF EXISTS "Allow public insert leads" ON public.leads;

-- Ensure RLS remains strictly enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Note on Lead Submissions:
-- All legitimate lead generation forms post payloads to /api/leads where server-side
-- sanitization, UK phone regex verification, and rate limiting take place before inserting
-- via the SUPABASE_SERVICE_ROLE_KEY admin client (which bypasses RLS safely).
