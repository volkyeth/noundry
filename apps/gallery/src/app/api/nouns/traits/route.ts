import { publicClient } from "@/app/publicClient";
import { NextResponse } from "next/server";
import { fetchMainnetArtwork } from "noggles";

export async function GET() {
  return NextResponse.json(await fetchMainnetArtwork(publicClient));
}
