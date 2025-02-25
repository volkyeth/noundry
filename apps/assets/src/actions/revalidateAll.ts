"use server";

import { revalidatePath } from "next/cache";

export async function revalidateAll() {
    revalidatePath("/nouns/image-data.js");
    revalidatePath("/nouns/image-data.json");
    revalidatePath("/nouns/art-data.json");
}