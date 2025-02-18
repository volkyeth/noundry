
import { publicClient } from "@/publicClient";
import { NextResponse } from "next/server";
import { fetchOnchainNounsArtData } from "noggles";

export const revalidate = 900;

export async function GET() {
    return new NextResponse(JSON.stringify(await fetchOnchainNounsArtData(publicClient)), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=604800`
    },
  });
}
