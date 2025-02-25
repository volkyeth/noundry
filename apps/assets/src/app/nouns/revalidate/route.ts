import { revalidateAll } from "@/actions/revalidateAll";
import { NextResponse } from "next/server";

export async function GET() {
  revalidateAll();

  return NextResponse.json({ message: "Revalidated" });
}
