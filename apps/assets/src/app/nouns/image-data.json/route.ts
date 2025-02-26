import { CACHE_CONTROL, CDN_CACHE_DURATION } from "@/config/cache";
import { publicClient } from "@/publicClient";
import { NextResponse } from "next/server";
import { fetchOnchainNounsArtData, nounsTraitNames, toImageData } from "noggles";

// Set revalidation time to match CDN cache duration
export const revalidate = CDN_CACHE_DURATION;

export async function GET() {
  const response = new NextResponse(JSON.stringify(toImageData(await fetchOnchainNounsArtData(publicClient), nounsTraitNames), null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': CACHE_CONTROL
    },
  });

  return response;
}
