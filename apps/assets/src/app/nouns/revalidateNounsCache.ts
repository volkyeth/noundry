"use server";

import { revalidatePath } from "next/cache";

export async function revalidateNounsCache() {
    revalidatePath("/nouns/image-data.js");
    revalidatePath("/nouns/image-data.json");
    revalidatePath("/nouns/art-data.json");
}