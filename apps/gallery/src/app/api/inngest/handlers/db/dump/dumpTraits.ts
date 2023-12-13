import { TraitSchema } from "@/db/schema/TraitSchema";
import { database } from "@/utils/database/db";
import { inngest } from "@/utils/inngest/client";

export const dumpTraits = inngest.createFunction(
  { id: "dump-traits" },
  {
    event: "db/dump",
  },
  async ({ event, step }) => {
    await step.run(
      "Dump all traits",
      async () =>
        await database.collection<TraitSchema>("nfts").find().toArray()
    );
  }
);
