"use server";

import { publicClient } from "@/app/publicClient";
import { UserSchema } from "@/db/schema/UserSchema";
import { LowercaseAddress } from "@/types/address";
import { database } from "@/utils/database/db";

export async function upsertUser(address: LowercaseAddress): Promise<void> {
    // Upsert user
    const upsert = await database
        .collection<UserSchema>("users")
        .updateOne(
            { _id: address },
            { $set: { _id: address } },
            { upsert: true }
        );

    if (!upsert.acknowledged) {
        throw new Error("Failed to upsert user");
    }

    // Update user ENS name and avatar
    const ensName =
        (await publicClient.getEnsName({
            address,
        })) ?? undefined;

    const ensAvatar = ensName
        ? (await publicClient.getEnsAvatar({ name: ensName })) ?? undefined
        : undefined;

    const updateEns = await database
        .collection<UserSchema>("users")
        .updateOne(
            { _id: address },
            { $set: { ensAvatar, ensName } }
        );

    if (!updateEns.acknowledged) {
        throw new Error("Failed to update user's ENS name and avatar");
    }
} 