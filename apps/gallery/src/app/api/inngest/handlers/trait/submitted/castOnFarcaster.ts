import { getFarcasterUser } from "@/app/api/farcaster/user/[address]/getFarcasterUser";
import { getUserInfo } from "@/app/api/user/[address]/info/getUserInfo";
import { SITE_URI } from "@/constants/config";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { inngest } from "@/inngest/client";
import { database } from "@/utils/database/db";
import { formatTraitType } from "@/utils/traits/format";
import { ObjectId } from "mongodb";

export const castOnFarcaster = inngest.createFunction(
  { id: "cast-on-farcaster" },
  { event: "trait/submitted" },
  async ({ event, step }) => {
    if (!process.env.NEYNAR_API_KEY) throw new Error("NEYNAR_API_KEY not set");
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
${trait.name} ${formatTraitType(trait.type)}

(Yes, testing in prod ¯\\_(ツ)_/¯)`;

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

    return { event, response: await response.json() };
  }
);
