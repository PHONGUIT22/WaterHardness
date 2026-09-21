-- =============================================================================
-- Migration: Create `leads` table for WaterHardness.uk Lead Generation Engine
-- Ticket value: £1,200–£2,500 (Water Softener) / £350–£600 (BS 7593 Boiler Care)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    outcode TEXT NOT NULL,
    city_or_town TEXT,
    ppm_reading NUMERIC,
    service_needed TEXT NOT NULL CHECK (service_needed IN ('water_softener', 'boiler_protection', 'drinking_filter', 'both')),
    property_type TEXT NOT NULL CHECK (property_type IN ('detached', 'semi_detached', 'terraced', 'flat_apartment')),
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    urgency TEXT NOT NULL DEFAULT 'within_month' CHECK (urgency IN ('asap', 'within_month', 'planning_budget')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'verified', 'forwarded', 'sold'))
);

-- Comments for schema documentation
COMMENT ON TABLE public.leads IS 'Qualified homeowner leads for water softeners, boiler descaling, and filtration systems in the UK.';
COMMENT ON COLUMN public.leads.outcode IS 'UK Outcode (e.g. GU21, SW1A, KT22).';
COMMENT ON COLUMN public.leads.ppm_reading IS 'Local water hardness PPM at time of inquiry.';
COMMENT ON COLUMN public.leads.service_needed IS 'Service category requested by homeowner.';
COMMENT ON COLUMN public.leads.status IS 'Lead qualification and dispatch status.';

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public anonymous insertion from the website quote form
CREATE POLICY "Allow public insert leads" 
ON public.leads 
FOR INSERT 
TO public
WITH CHECK (true);

-- Policy 2: Allow authenticated staff / service role to read and manage leads
CREATE POLICY "Allow authenticated read leads" 
ON public.leads 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated update leads" 
ON public.leads 
FOR UPDATE 
TO authenticated 
USING (true);

-- Performance & Triage Indexes
CREATE INDEX IF NOT EXISTS idx_leads_outcode ON public.leads(outcode);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_service_needed ON public.leads(service_needed);
