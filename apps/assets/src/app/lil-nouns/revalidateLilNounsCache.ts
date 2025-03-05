"use server";

import { revalidatePath } from "next/cache";

export async function revalidateLilNounsCache() {
    revalidatePath("/lil-nouns/image-data.js");
    revalidatePath("/lil-nouns/image-data.json");
    revalidatePath("/lil-nouns/art-data.json");
}