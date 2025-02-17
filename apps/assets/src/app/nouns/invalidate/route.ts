import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  revalidatePath("/nouns/image-data.js");
  revalidatePath("/nouns/image-data.json");

  return NextResponse.json({ message: "Invalidated" });
}
