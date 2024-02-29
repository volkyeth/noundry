import { getCordServerToken } from "@/app/api/cord/getCordServerToken";
import { SITE_URI } from "@/constants/config";
import { CORD_GROUP_ID } from "@/constants/cord";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { getTraitThreadId } from "@/utils/cord/getTraitThreadId";
import { getTraitThreadLocation } from "@/utils/cord/getTraitThreadLocation";
import { database } from "@/utils/database/db";
import { inngest } from "@/utils/inngest/client";
import { formatTraitType } from "@/utils/traits/format";
import { ObjectId } from "mongodb";

export const createCordThread = inngest.createFunction(
  { id: "create-cord-thread" },
  { event: "trait/submitted" },
  async ({ event, step }) => {
    await step.run("Create Cord trait thread", async () => {
      const traitId = event.data.traitId;

      const trait = await database
        .collection<TraitSchema>("nfts")
        .findOne({ _id: new ObjectId(traitId) });

      if (!trait) {
        throw new Error(`Trait with id ${traitId} not found`);
      }

      const cordToken = await getCordServerToken();

      const response = await fetch("https://api.cord.com/v1/threads", {
        headers: {
          Authorization: `Bearer ${cordToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          name: `${trait.name} ${formatTraitType(trait.type)}`,
          url: `${SITE_URI}/trait/${traitId}`,
          groupID: CORD_GROUP_ID,
          location: getTraitThreadLocation(traitId),
          id: getTraitThreadId(traitId),
          addSubscribers: [trait.address],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create Cord thread`, await response.json());
      }

      return response.json();
    });
  }
);
