import { CACHE_CONTROL, CDN_CACHE_DURATION } from "@/config/cache";
import { publicClient } from "@/publicClient";
import { NextResponse } from "next/server";
import { fetchOnchainNounsArtData } from "noggles";

// Set revalidation time to match CDN cache duration
export const revalidate = CDN_CACHE_DURATION;

export async function GET() {
  return new NextResponse(JSON.stringify(await fetchOnchainNounsArtData(publicClient)), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': CACHE_CONTROL
    },
  });
}
