import { getCordServerToken } from "@/app/api/cord/getCordServerToken";
import { getUserInfo } from "@/app/api/user/[address]/info/getUserInfo";
import { SITE_URI } from "@/constants/config";
import { CORD_GROUP_ID } from "@/constants/cord";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { UserSchema } from "@/db/schema/UserSchema";
import { getTraitThreadId } from "@/utils/cord/getTraitThreadId";
import { getTraitThreadLocation } from "@/utils/cord/getTraitThreadLocation";
import { database } from "@/utils/database/db";
import { inngest } from "@/utils/inngest/client";
import { formatTraitType } from "@/utils/traits/format";

export const initCordData = inngest.createFunction(
  { id: "init-cord-data" },
  {
    event: "cord/init",
  },
  async ({ event, step }) => {
    await step.run("Init Cord users", async () => {
      return;
      const users = await database
        .collection<UserSchema>("users")
        .find()
        .toArray();

      const cordToken = await getCordServerToken();

      for (const user of users) {
        const userInfo = await getUserInfo(user._id);
        console.log("Adding user to Cord", userInfo.userName);
        const response = await fetch(
          `https://api.cord.com/v1/users/${userInfo.address}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${cordToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: userInfo.userName,
              profilePictureURL: userInfo?.profilePic ?? undefined,
            }),
          }
        );

        if (!response.ok) {
          console.error(`Failed to add user to Cord`, await response.json());
          throw new Error(`Failed to add user to Cord`);
        }
      }

      console.log("Adding users to Cord group");
      const addToGroup = await fetch(
        `https://api.cord.com/v1/groups/${CORD_GROUP_ID}/members`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cordToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ add: users.map((u) => u._id) }),
        }
      );

      if (!addToGroup.ok) {
        throw new Error(
          `Failed to add users to Cord group`,
          await addToGroup.json()
        );
      }
    });

    await step.run("Cleanup threads", async () => {
      const cordToken = await getCordServerToken();

      const threads = await fetch("https://api.cord.com/v1/threads/", {
        headers: {
          Authorization: `Bearer ${cordToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((r) => r.json())
        .then((r) => r.threads);

      for (const thread of threads) {
        console.log("Deleting thread", thread.id);
        const response = await fetch(
          `https://api.cord.com/v1/threads/${thread.id}`,
          {
            headers: {
              Authorization: `Bearer ${cordToken}`,
              "Content-Type": "application/json",
            },
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to delete Cord thread`,
            await response.json()
          );
        }
      }
    });

    await step.run(
      "Create trait threads and subscribe authors to them",
      async () => {
        const traits = await database
          .collection<TraitSchema>("nfts")
          .find()
          .toArray();

        let cordToken = await getCordServerToken();

        for (let i = 0; i < traits.length; i++) {
          const trait = traits[i];
          if (i % 100 === 0) {
            cordToken = await getCordServerToken();
          }

          const response = await fetch("https://api.cord.com/v1/threads", {
            headers: {
              Authorization: `Bearer ${cordToken}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              name: `${trait.name} ${formatTraitType(trait.type)}`,
              url: `${SITE_URI}/trait/${trait._id.toString()}`,
              groupID: CORD_GROUP_ID,
              location: getTraitThreadLocation(trait._id.toString()),
              id: getTraitThreadId(trait._id.toString()),
              addSubscribers: [trait.address],
            }),
          });

          if (!response.ok) {
            console.error(
              "Failed to create Cord thread",
              response,
              await response.json()
            );
            throw new Error(`Failed to create Cord thread`);
          }

          console.log("Created Cord thread", trait._id.toString());
        }
      }
    );
  }
);
