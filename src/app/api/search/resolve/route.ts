import { NextResponse } from "next/server";
import { resolveSearchDestination } from "@/lib/search";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || searchParams.get("query") || "").trim();

    if (!query) {
      return NextResponse.json({ destination: "/outcodes" });
    }

    const destination = await resolveSearchDestination(query);
    return NextResponse.json(
      { destination },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (err: any) {
    console.error("Search resolve API error:", err);
    return NextResponse.json({ destination: "/outcodes" }, { status: 200 });
  }
}
