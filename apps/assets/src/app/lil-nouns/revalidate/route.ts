import { revalidateLilNounsCache } from "@/app/lil-nouns/revalidateLilNounsCache";
import { NextResponse } from "next/server";

export async function GET() {
  revalidateLilNounsCache();

  return NextResponse.json({ message: "Revalidated" });
}
