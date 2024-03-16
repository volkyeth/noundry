import { getFarcasterUser } from "@/app/api/farcaster/user/[address]/getFarcasterUser";
import { getUserInfo } from "@/app/api/user/[address]/info/getUserInfo";
import { SITE_URI } from "@/constants/config";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { database } from "@/utils/database/db";
import { inngest } from "@/utils/inngest/client";
import { formatTraitType } from "@/utils/traits/format";
import { ObjectId } from "mongodb";

export const castOnFarcaster = inngest.createFunction(
  { id: "cast-on-farcaster" },
  { event: "trait/submitted" },
  async ({ event, step }) => {
    const castedOnFarcaster = await step.run("cast on farcaster", async () => {
      if (!process.env.NEYNAR_API_KEY)
        throw new Error("NEYNAR_API_KEY not set");
      if (!process.env.NOUNDRY_NEYNAR_SIGNER_UUID)
        throw new Error("NOUNDRY_NEYNAR_SIGNER_UUID not set");

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

      const farcasterUser = await getFarcasterUser(trait.address);

      const author = farcasterUser
        ? "@" + farcasterUser.username
        : (await getUserInfo(trait.address)).userName;

      const castBody = `New submission by ${author}:
${trait.name} ${formatTraitType(trait.type)}`;

      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          api_key: process.env.NEYNAR_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          signer_uuid: process.env.NOUNDRY_NEYNAR_SIGNER_UUID,
          text: castBody,
          embeds: [{ url: `${SITE_URI}/trait/${traitId}` }],
          channel_id: "noundry",
        }),
      };

      await prefetchOgImage;

      const response = await fetch(
        "https://api.neynar.com/v2/farcaster/cast",
        options
      );

      if (!response.ok) {
        throw new Error(`Error casting trait ${traitId}`);
      }

      return {
        event,
        response: (await response.json()) as {
          cast: {
            hash: string;
          };
        },
      };
    });

    const traitWasDeleted = await step.waitForEvent(
      "watch-for-trait-deletion",
      { event: "trait/deleted", timeout: "24h", match: "data.traitId" }
    );

    if (traitWasDeleted) {
      await step.run("delete cast", async () => {
        if (!process.env.NEYNAR_API_KEY)
          throw new Error("NEYNAR_API_KEY not set");
        if (!process.env.NOUNDRY_NEYNAR_SIGNER_UUID)
          throw new Error("NOUNDRY_NEYNAR_SIGNER_UUID not set");

        const castHash = castedOnFarcaster.response.cast.hash;

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
          throw new Error(`Error deleting cast`, {
            cause: await response.json(),
          });
        }

        return { event: traitWasDeleted, result: await response.json() };
      });
    }
  }
);
