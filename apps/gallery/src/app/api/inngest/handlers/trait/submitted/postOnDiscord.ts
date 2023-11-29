import { getUserInfo } from "@/app/api/user/[address]/info/getUserInfo";
import { SITE_URI } from "@/constants/config";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { inngest } from "@/inngest/client";
import { database } from "@/utils/database/db";
import { formatTraitType } from "@/utils/traits/format";
import { Client } from "detritus-client-rest";
import {
  RESTDeleteAPIChannelMessageResult,
  RESTPostAPIChannelMessageResult,
} from "discord-api-types/rest/v10";
import { ObjectId } from "mongodb";

export const postOnDiscord = inngest.createFunction(
  { id: "post-on-discord" },
  { event: "trait/submitted" },
  async ({ event, step }) => {
    const postedToDiscord = await step.run("post to discord", async () => {
      if (!process.env.NOUNDRY_SUBMISSIONS_DISCORD_CHANNEL_ID)
        throw new Error("NOUNDRY_SUBMISSIONS_DISCORD_CHANNEL_ID not set");
      if (!process.env.NOUNDRY_DISCORD_BOT_TOKEN)
        throw new Error("NOUNDRY_DISCORD_BOT_TOKEN not set");

      const client = new Client(process.env.NOUNDRY_DISCORD_BOT_TOKEN);

      const traitId = event.data.traitId;
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

      const message = (await client.createMessage(
        process.env.NOUNDRY_SUBMISSIONS_DISCORD_CHANNEL_ID,
        {
          content: `New submission by ${author}:\n${
            trait.name
          } ${formatTraitType(trait.type)}`,
          embed: {
            url: `${SITE_URI}/trait/${traitId}`,
            image: { url: `${SITE_URI}/api/trait/${traitId}/og` },
            title: `${trait.name} ${formatTraitType(trait.type)}`,
            author: {
              name: author,
              url: `${SITE_URI}/profile/${trait.address}`,
            },
            provider: { name: "Noundry Gallery", url: SITE_URI },
            color: 0xff2165,
          },
        }
      )) as RESTPostAPIChannelMessageResult;

      return { event, message };
    });

    const traitWasDeleted = await step.waitForEvent(
      "watch-for-trait-deletion",
      { event: "trait/deleted", timeout: "24h", match: "data.traitId" }
    );

    if (traitWasDeleted) {
      await step.run("delete discord message", async () => {
        if (!process.env.NOUNDRY_SUBMISSIONS_DISCORD_CHANNEL_ID)
          throw new Error("NOUNDRY_SUBMISSIONS_DISCORD_CHANNEL_ID not set");
        if (!process.env.NOUNDRY_DISCORD_BOT_TOKEN)
          throw new Error("NOUNDRY_DISCORD_BOT_TOKEN not set");

        const client = new Client(process.env.NOUNDRY_DISCORD_BOT_TOKEN);

        const result = (await client.deleteMessage(
          process.env.NOUNDRY_SUBMISSIONS_DISCORD_CHANNEL_ID,
          postedToDiscord.message.id,
          { reason: "Trait deleted" }
        )) as RESTDeleteAPIChannelMessageResult;

        return { event: traitWasDeleted, result };
      });
    }
  }
);
