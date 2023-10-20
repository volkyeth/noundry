import { publicClient } from "@/app/publicClient";
import { NextResponse } from "next/server";
import { fetchNounsArtwork } from "noggles";

export async function GET() {
  // TODO cache for 15min
  return NextResponse.json(await fetchNounsArtwork(publicClient));
}
