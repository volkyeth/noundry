import { publicClient } from "@/app/publicClient";
import { UserSchema } from "@/db/schema/UserSchema";
import { database } from "@/utils/database/db";
import { inngest } from "@/utils/inngest/client";

export const upsertUser = inngest.createFunction(
  { id: "upsert-user-on-sign-in" },
  { event: "user/signed-in" },
  async ({ event, step }) => {
    await step.run("Upsert user on sign in", async () => {
      const upsert = await database
        .collection<UserSchema>("users")
        .updateOne(
          { _id: event.data.address },
          { $set: { _id: event.data.address } },
          { upsert: true }
        );

      if (!upsert.acknowledged) {
        throw new Error("Failed to upsert user");
      }
    });

    await step.run("Update user ens name and avatar", async () => {
      const ensName =
        (await publicClient.getEnsName({
          address: event.data.address,
        })) ?? undefined;

      const ensAvatar = ensName
        ? (await publicClient.getEnsAvatar({ name: ensName })) ?? undefined
        : undefined;

      const upsert = await database
        .collection<UserSchema>("users")
        .updateOne(
          { _id: event.data.address },
          { $set: { ensAvatar, ensName } }
        );

      if (!upsert.acknowledged) {
        throw new Error("Failed to update user's ens name and avatar");
      }
    });
  }
);
