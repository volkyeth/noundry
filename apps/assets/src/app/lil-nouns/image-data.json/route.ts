import { CACHE_HEADERS, CDN_CACHE_DURATION, CORS_HEADERS } from "@/config/cache";
import { lilNounsImageData } from "@/staticAssetData";
import { NextResponse } from "next/server";

// Set revalidation time to match CDN cache duration
export const revalidate = CDN_CACHE_DURATION;

export async function GET() {
  const response = new NextResponse(JSON.stringify(lilNounsImageData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      ...CACHE_HEADERS,
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
