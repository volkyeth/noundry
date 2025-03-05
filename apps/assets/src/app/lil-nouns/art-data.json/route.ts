import { CACHE_HEADERS, CDN_CACHE_DURATION, CORS_HEADERS } from "@/config/cache";
import { publicClient } from "@/publicClient";
import { NextResponse } from "next/server";
import { fetchOnchainLilNounsArtData } from "noggles";

// Set revalidation time to match CDN cache duration
export const revalidate = CDN_CACHE_DURATION;

export async function GET() {
  return new NextResponse(JSON.stringify(await fetchOnchainLilNounsArtData(publicClient)), {
    headers: {
      'Content-Type': 'application/json',
      ...CACHE_HEADERS,
      ...CORS_HEADERS
    },
  });
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: CORS_HEADERS
  });
}
