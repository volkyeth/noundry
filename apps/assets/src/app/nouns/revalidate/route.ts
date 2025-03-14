import { revalidateNounsCache } from "@/app/nouns/revalidateNounsCache";
import { NextResponse } from "next/server";

export async function GET() {
  revalidateNounsCache();

  return NextResponse.json({ message: "Revalidated" });
}
