import { publicClient } from "@/publicClient";
import { NextResponse } from "next/server";
import { fetchOnchainNounsArtData, nounsTraitNames, toImageData } from "noggles";

export const revalidate = 900;

export async function GET() {
  const response = NextResponse.json(toImageData(await fetchOnchainNounsArtData(publicClient), nounsTraitNames));

  response.headers.set('Cache-Control', `public, s-maxage=${revalidate}, stale-while-revalidate=604800`);

  return response;
}
