import { CACHE_CONTROL, CDN_CACHE_DURATION, CORS_HEADERS } from "@/config/cache";
import { publicClient } from "@/publicClient";
import { NextResponse } from "next/server";
import { fetchOnchainNounsArtData, nounsTraitNames, toImageData } from "noggles";

// Set revalidation time to match CDN cache duration
export const revalidate = CDN_CACHE_DURATION;

export async function GET() {
  const response = new NextResponse(JSON.stringify(toImageData(await fetchOnchainNounsArtData(publicClient), nounsTraitNames), null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': CACHE_CONTROL,
      ...CORS_HEADERS
    },
  });

  return response;
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: CORS_HEADERS
  });
}
