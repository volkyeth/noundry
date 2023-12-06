import { TraitSchema } from "@/db/schema/TraitSchema";
import { inngest } from "@/inngest/client";
import { database } from "@/utils/database/db";

export const migrateLikedByToLowercase = inngest.createFunction(
  { id: "migration-liked-by-to-lowercase" },
  {
    event: "db/migrate",
    if: 'event.data.migrationId == "liked-by-to-lowercase"',
  },
  async ({ event, step }) => {
    await step.run(
      "convert all trait likedBy addresses to lowercase and cleanup unused fields",
      async () => {
        const result = await database
          .collection<TraitSchema>("nfts")
          .updateMany({}, [
            {
              $set: {
                likedBy: {
                  $map: {
                    input: "$likedBy",
                    as: "str",
                    in: { $toLower: "$$str" },
                  },
                },
              },
            },
            {
              $unset: [
                "twitter",
                "background",
                "body",
                "head",
                "accessory",
                "glasses",
                "likesCount",
                "creator",
              ],
            },
          ]);

        return result;
      }
    );
  }
);
