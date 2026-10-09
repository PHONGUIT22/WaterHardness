# Supabase Database Migrations & Security Architecture

This directory contains database schema migrations for the UK Water Hardness platform.

## Migrations Overview

### 1. `20260921_create_leads_table.sql`
- Creates the `public.leads` table to store installer quote inquiries.
- Configures schema fields: outcode, city, PPM readings, service requested, property details, and contact info.

### 2. `20261009_create_outcodes_summary_view.sql`
- **Purpose**: Eliminates serverless memory bottlenecks when fetching outcode aggregates across ~15,000 raw postcode sector rows.
- **View**: `public.water_hardness_outcodes_summary`
- Pre-aggregates:
  - `outcode` (extracted via regex `^[A-Z]{1,2}[0-9][A-Z0-9]?`)
  - `water_company`
  - `sector_count` (`COUNT(*)`)
  - `avg_ppm` (`ROUND(AVG(avg_ppm)::numeric, 1)`)
  - `avg_clark_degrees` (`ROUND(AVG(clark_degrees)::numeric, 1)`)
- Grants `SELECT` permission to `anon`, `authenticated`, and `service_role`.

### 3. `20261009_secure_leads_rls.sql`
- **Purpose**: Hardens security for customer lead information.
- Drops public/anonymous direct `INSERT` permissions on `public.leads` to prevent unauthorized client-side spam or scraping.
- Grants full read/write management to `service_role`.
- Web API lead submissions now route exclusively through `src/app/api/leads/route.ts` powered by `supabaseAdmin` (`SUPABASE_SERVICE_ROLE_KEY`).

## Environment Configuration

Ensure the following variables are configured in your deployment environment (Vercel / production):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # Required for secure backend lead writes
```

> **Note**: If `SUPABASE_SERVICE_ROLE_KEY` is not supplied, `supabaseAdmin` in `src/lib/supabaseServer.ts` safely falls back to `NEXT_PUBLIC_SUPABASE_ANON_KEY` with a warning log for graceful transition.
