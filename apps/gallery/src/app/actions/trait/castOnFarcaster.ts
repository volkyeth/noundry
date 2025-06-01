"use server";

import { getUserInfo } from "@/app/actions/getUserInfo";
import { getFarcasterUser } from "@/app/api/farcaster/user/[address]/getFarcasterUser";
import { SITE_URI } from "@/constants/config";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { database } from "@/utils/database/db";
import { formatSubmissionType } from "@/utils/traits/format";
import { ObjectId } from "mongodb";

export async function castTraitOnFarcaster(traitId: string): Promise<void> {
    if (!process.env.NEYNAR_API_KEY)
        throw new Error("NEYNAR_API_KEY not set");
    if (!process.env.NOUNDRY_NEYNAR_SIGNER_UUID)
        throw new Error("NOUNDRY_NEYNAR_SIGNER_UUID not set");

    const trait = await database
        .collection<TraitSchema>("nfts")
        .findOne({ _id: new ObjectId(traitId) });

    if (!trait) {
        throw new Error(`Trait with id ${traitId} not found`);
    }

    // Try to get the Farcaster user, fall back to regular username
    const farcasterUser = await getFarcasterUser(trait.address).catch(() => null);
    const author = farcasterUser
        ? "@" + farcasterUser.username
        : (await getUserInfo(trait.address)).userName;

    // Prefetch the OG image
    await fetch(`${SITE_URI}/api/trait/${traitId}/og`);

    const castBody = `New submission by ${author}:
${trait.name} ${formatSubmissionType(trait.type)}`;

    // Use the Neynar API directly
    const neynarApiUrl = "https://api.neynar.com/v2/farcaster/cast";
    const response = await fetch(neynarApiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api_key": process.env.NEYNAR_API_KEY,
            accept: "application/json",
        },
        body: JSON.stringify({
            signer_uuid: process.env.NOUNDRY_NEYNAR_SIGNER_UUID,
            text: castBody,
            embeds: [
                {
                    url: `${SITE_URI}/trait/${traitId}`,
                },
            ],
            channel_id: "noundry",
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to cast on Farcaster: ${JSON.stringify(errorData)}`);
    }

    // Parse the response to get the cast hash
    const responseData = await response.json() as { cast: { hash: string } };
    const castHash = responseData.cast.hash;

    // Store the cast hash in the database
    await database
        .collection<TraitSchema>("nfts")
        .updateOne(
            { _id: new ObjectId(traitId) },
            { $set: { farcasterCastHash: castHash } }
        );
}

/**
 * Server action to delete a trait cast from Farcaster
 * This would be called when a trait is deleted
 */
export async function deleteTraitFromFarcaster(castHash: string): Promise<void> {
    if (!process.env.NEYNAR_API_KEY)
        throw new Error("NEYNAR_API_KEY not set");
    if (!process.env.NOUNDRY_NEYNAR_SIGNER_UUID)
        throw new Error("NOUNDRY_NEYNAR_SIGNER_UUID not set");

    const options = {
        method: "DELETE",
        headers: {
            accept: "application/json",
            api_key: process.env.NEYNAR_API_KEY,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            target_hash: castHash,
            signer_uuid: process.env.NOUNDRY_NEYNAR_SIGNER_UUID,
        }),
    };

    const response = await fetch(
        "https://api.neynar.com/v2/farcaster/cast",
        options
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to delete cast on Farcaster: ${JSON.stringify(errorData)}`);
    }
} 