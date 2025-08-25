"use server";

import { getUserInfo } from "@/app/actions/getUserInfo";
import { SITE_URI } from "@/constants/config";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { getDatabase } from "@/utils/database/db";
import { formatSubmissionType } from "@/utils/traits/format";
import { Client } from "detritus-client-rest";
import { RESTPostAPIChannelMessageResult } from "discord-api-types/rest/v10";
import { ObjectId } from "mongodb";

export async function postTraitOnDiscord(traitId: string): Promise<void> {
    if (!process.env.NOUNDRY_SUBMISSIONS_DISCORD_CHANNEL_ID)
        throw new Error("NOUNDRY_SUBMISSIONS_DISCORD_CHANNEL_ID not set");
    if (!process.env.NOUNDRY_DISCORD_BOT_TOKEN)
        throw new Error("NOUNDRY_DISCORD_BOT_TOKEN not set");

    const client = new Client(process.env.NOUNDRY_DISCORD_BOT_TOKEN);

    const database = await getDatabase();
    const trait = await database
        .collection<TraitSchema>("nfts")
        .findOne({ _id: new ObjectId(traitId) });

    if (!trait) {
        throw new Error(`Trait with id ${traitId} not found`);
    }

    const prefetchOgImage = fetch(`${SITE_URI}/api/trait/${traitId}/og`).then(
        (r) => {
            if (!r.ok)
                throw new Error(`Error fetching og image for trait ${traitId}`);
        }
    );

    const author = (await getUserInfo(trait.address)).userName;

    await prefetchOgImage;

    const message = await client.createMessage(
        process.env.NOUNDRY_SUBMISSIONS_DISCORD_CHANNEL_ID,
        {
            content: `New ${trait.remixedFrom ? "remix" : "submission"} by ${author}:\n${trait.name
                } ${formatSubmissionType(trait.type)}`,
            embed: {
                url: `${SITE_URI}/trait/${traitId}`,
                image: { url: `${SITE_URI}/api/trait/${traitId}/og` },
                title: `${trait.name} ${formatSubmissionType(trait.type)}`,
                author: {
                    name: author,
                    url: `${SITE_URI}/profile/${trait.address}`,
                },
                provider: { name: "Noundry Gallery", url: SITE_URI },
                color: 0xff2165,
            },
        }
    ) as RESTPostAPIChannelMessageResult;

    // Store the message ID and channel ID in the database
    await database
        .collection<TraitSchema>("nfts")
        .updateOne(
            { _id: new ObjectId(traitId) },
            {
                $set: {
                    discordPostId: message.id
                }
            }
        );
}

/**
 * Server action to delete a trait message from Discord
 * This would be called when a trait is deleted
 */
export async function deleteTraitFromDiscord(messageId: string, channelId: string): Promise<void> {
    if (!process.env.NOUNDRY_DISCORD_BOT_TOKEN)
        throw new Error("NOUNDRY_DISCORD_BOT_TOKEN not set");

    const client = new Client(process.env.NOUNDRY_DISCORD_BOT_TOKEN);

    await client.deleteMessage(
        channelId,
        messageId,
        { reason: "Trait deleted" }
    );
} 