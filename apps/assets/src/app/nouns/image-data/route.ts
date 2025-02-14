import { publicClient } from "@/publicClient";
import { NextResponse } from "next/server";
import { fetchNounsArtwork } from "noggles";

export const runtime = 'edge';
export const revalidate = 900;

export async function GET() {
  const response = NextResponse.json(await fetchNounsArtwork(publicClient));

  response.headers.set('Cache-Control', `public, s-maxage=${revalidate}, stale-while-revalidate=604800`);

  return response;
}
