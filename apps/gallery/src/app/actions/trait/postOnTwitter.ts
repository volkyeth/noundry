"use server";

import { getUserInfo } from "@/app/actions/getUserInfo";
import { SITE_URI } from "@/constants/config";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { getDatabase } from "@/utils/database/db";
import { formatSubmissionType } from "@/utils/traits/format";
import { ObjectId } from "mongodb";
import { TwitterApi } from "twitter-api-v2";

export async function postTraitOnTwitter(traitId: string): Promise<void> {
    if (!process.env.NOUNDRY_TWITTER_APP_KEY)
        throw new Error("NOUNDRY_TWITTER_APP_KEY not set");
    if (!process.env.NOUNDRY_TWITTER_APP_SECRET)
        throw new Error("NOUNDRY_TWITTER_APP_SECRET not set");
    if (!process.env.NOUNDRY_TWITTER_ACCESS_TOKEN)
        throw new Error("NOUNDRY_TWITTER_ACCESS_TOKEN not set");
    if (!process.env.NOUNDRY_TWITTER_ACCESS_TOKEN_SECRET)
        throw new Error("NOUNDRY_TWITTER_ACCESS_TOKEN_SECRET not set");

    const database = await getDatabase();
    const trait = await database
        .collection<TraitSchema>("nfts")
        .findOne({ _id: new ObjectId(traitId) });

    if (!trait) {
        throw new Error(`Trait with id ${traitId} not found`);
    }

    const author = (await getUserInfo(trait.address)).userName;

    const client = new TwitterApi({
        appKey: process.env.NOUNDRY_TWITTER_APP_KEY,
        appSecret: process.env.NOUNDRY_TWITTER_APP_SECRET,
        accessToken: process.env.NOUNDRY_TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.NOUNDRY_TWITTER_ACCESS_TOKEN_SECRET,
    });

    const ogImageUrl = `${SITE_URI}/api/trait/${traitId}/og`;

    // Prefetch the og image
    await fetch(ogImageUrl);

    const result = await client.v2.tweet(
        `New ${trait.remixedFrom ? "remix" : "submission"} by ${author}:\n${trait.name} ${formatSubmissionType(
            trait.type
        )}\n\n${SITE_URI}/trait/${traitId}`
    );

    if (result?.errors) {
        throw new Error("Failed to post trait to Twitter", { cause: result.errors });
    }

    await database
        .collection<TraitSchema>("nfts")
        .updateOne({ _id: new ObjectId(traitId) }, { $set: { twitterPostId: result.data.id } });
}

/**
 * Server action to delete a trait post from Twitter
 * This would be called when a trait is deleted
 */
export async function deleteTraitFromTwitter(tweetId: string): Promise<void> {
    if (!process.env.NOUNDRY_TWITTER_APP_KEY)
        throw new Error("NOUNDRY_TWITTER_APP_KEY not set");
    if (!process.env.NOUNDRY_TWITTER_APP_SECRET)
        throw new Error("NOUNDRY_TWITTER_APP_SECRET not set");
    if (!process.env.NOUNDRY_TWITTER_ACCESS_TOKEN)
        throw new Error("NOUNDRY_TWITTER_ACCESS_TOKEN not set");
    if (!process.env.NOUNDRY_TWITTER_ACCESS_TOKEN_SECRET)
        throw new Error("NOUNDRY_TWITTER_ACCESS_TOKEN_SECRET not set");

    const client = new TwitterApi({
        appKey: process.env.NOUNDRY_TWITTER_APP_KEY,
        appSecret: process.env.NOUNDRY_TWITTER_APP_SECRET,
        accessToken: process.env.NOUNDRY_TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.NOUNDRY_TWITTER_ACCESS_TOKEN_SECRET,
    });

    const result = await client.v2.deleteTweet(tweetId);

    if (result?.errors) {
        throw new Error("Failed to delete tweet", { cause: result.errors });
    }
} 