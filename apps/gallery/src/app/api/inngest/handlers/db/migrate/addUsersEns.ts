import { publicClient } from "@/app/publicClient";
import { UserSchema } from "@/db/schema/UserSchema";
import { database } from "@/utils/database/db";
import { inngest } from "@/utils/inngest/client";
import { getAddress } from "viem";

export const migrateAddUsersEns = inngest.createFunction(
  { id: "migration-add-users-ens" },
  {
    event: "db/migrate",
    if: 'event.data.migrationId == "add-users-ens"',
  },
  async ({ event, step, logger }) => {
    await step.run("Add users ens name and avatar", async () => {
      const users = await database
        .collection<UserSchema>("users")
        .find({}, { projection: { _id: 1 } })
        .toArray();

      for (const user of users) {
        if (user._id !== getAddress(user._id)) {
          console.error("User address is not checksummed", user._id);
          continue;
        }

        console.log("Updating user", user._id);
        const ensName =
          (await publicClient.getEnsName({
            address: user._id,
          })) ?? undefined;

        const ensAvatar = ensName
          ? (await publicClient.getEnsAvatar({ name: ensName })) ?? undefined
          : undefined;

        if (!ensName && !ensAvatar) {
          continue;
        }

        const update = await database
          .collection<UserSchema>("users")
          .updateOne({ _id: user._id }, { $set: { ensAvatar, ensName } });

        if (!update.acknowledged) {
          throw new Error("Failed to update user's ens name and avatar");
        }
      }
    });
  }
);
