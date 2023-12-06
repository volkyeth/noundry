import { UserSchema } from "@/db/schema/UserSchema";
import { inngest } from "@/inngest/client";
import { database } from "@/utils/database/db";

export const dumpUsers = inngest.createFunction(
  { id: "dump-users" },
  {
    event: "db/dump",
  },
  async ({ event, step }) => {
    await step.run(
      "Dump all users",
      async () =>
        await database.collection<UserSchema>("users").find().toArray()
    );
  }
);
