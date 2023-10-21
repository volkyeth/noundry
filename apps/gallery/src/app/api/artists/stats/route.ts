import { NextResponse } from "next/server";
import { getArtistStats } from "./getArtistStats";

export async function GET() {
  return NextResponse.json(await getArtistStats());
}
