import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// UK Phone Number format validation:
// Supports Mobile (07xxx, +447xxx), Landline (01xxx, 02xxx, +441xxx, +442xxx)
function isValidUkPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
  // Standard UK mobile & geographic landline formats
  const ukPhoneRegex = /^(?:(?:\+44\s?|0044\s?|0))(?:7\d{9}|[12]\d{8,9})$/;
  return ukPhoneRegex.test(cleaned);
}

function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      outcode,
      city_or_town,
      ppm_reading,
      service_needed,
      property_type,
      full_name,
      phone_number,
      email,
      urgency,
    } = body;

    // 1. Required fields presence check
    if (!full_name || !phone_number || !email || !outcode) {
      return NextResponse.json(
        { success: false, error: "Please complete all required fields (Name, Phone, Email, Outcode)." },
        { status: 400 }
      );
    }

    // 2. Email format validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address (e.g. name@example.co.uk)." },
        { status: 400 }
      );
    }

    // 3. UK phone number format validation
    if (!isValidUkPhoneNumber(phone_number)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid UK phone number (e.g. 07123 456789 or 020 7946 0192).",
        },
        { status: 400 }
      );
    }

    // 4. Validate allowed enum values
    const validServices = ["water_softener", "boiler_protection", "drinking_filter", "both"];
    const sanitizedService = validServices.includes(service_needed) ? service_needed : "water_softener";

    const validPropertyTypes = ["detached", "semi_detached", "terraced", "flat_apartment"];
    const sanitizedPropertyType = validPropertyTypes.includes(property_type) ? property_type : "detached";

    const validUrgencies = ["asap", "within_month", "planning_budget"];
    const sanitizedUrgency = validUrgencies.includes(urgency) ? urgency : "within_month";

    // 5. Insert record into Supabase
    const leadId = crypto.randomUUID();
    const { error } = await supabase
      .from("leads")
      .insert([
        {
          id: leadId,
          outcode: outcode.trim().toUpperCase(),
          city_or_town: city_or_town ? String(city_or_town).trim() : null,
          ppm_reading: ppm_reading ? Number(ppm_reading) : null,
          service_needed: sanitizedService,
          property_type: sanitizedPropertyType,
          full_name: full_name.trim(),
          phone_number: phone_number.trim(),
          email: email.trim().toLowerCase(),
          urgency: sanitizedUrgency,
          status: "new",
        },
      ]);

    if (error) {
      console.error("Supabase insert lead error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save lead request. Please try again.",
          detail: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      leadId,
      message: "Lead registered successfully.",
    });
  } catch (err: any) {
    console.error("Lead submission exception:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
