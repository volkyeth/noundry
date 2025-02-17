import { publicClient } from "@/publicClient";
import { NextResponse } from "next/server";
import { fetchOnchainNounsArtData, nounsTraitNames, toImageData } from "noggles";

export const revalidate = 900;

export async function GET() {
  const response = new NextResponse(JSON.stringify(toImageData(await fetchOnchainNounsArtData(publicClient), nounsTraitNames), null, 2), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  response.headers.set('Cache-Control', `public, s-maxage=${revalidate}, stale-while-revalidate=604800`);

  return response;
}
