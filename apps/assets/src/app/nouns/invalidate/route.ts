import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  revalidatePath("/nouns/image-data");

  return NextResponse.json({ message: "Invalidated" });
}
