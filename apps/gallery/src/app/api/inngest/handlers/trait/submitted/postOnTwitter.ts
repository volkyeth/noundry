import { getUserInfo } from "@/app/actions/getUserInfo";
import { SITE_URI } from "@/constants/config";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { database } from "@/utils/database/db";
import { inngest } from "@/utils/inngest/client";
import { formatTraitType } from "@/utils/traits/format";
import { ObjectId } from "mongodb";
import { TwitterApi } from "twitter-api-v2";

export const postOnTwitter = inngest.createFunction(
  { id: "post-on-twitter" },
  { event: "trait/submitted" },
  async ({ event, step }) => {
    const postedToTwitter = await step.run("post to Twitter", async () => {
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

      const tweet = await client.v2.tweet(
        `New submission by ${author}:\n${trait.name} ${formatTraitType(
          trait.type
        )}

${SITE_URI}/trait/${traitId}`
      );

      if (tweet.errors)
        throw new Error("Failed tweeting", { cause: tweet.errors });

      return { event, tweet };
    });

    const traitWasDeleted = await step.waitForEvent(
      "watch-for-trait-deletion",
      { event: "trait/deleted", timeout: "24h", match: "data.traitId" }
    );

    if (traitWasDeleted) {
      await step.run("delete twitter post", async () => {
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

        const result = await client.v2.deleteTweet(
          postedToTwitter.tweet.data!.id
        );

        if (result.errors)
          throw new Error("Failed deleting tweet", { cause: result.errors });

        return { event: traitWasDeleted, result };
      });
    }
  }
);
