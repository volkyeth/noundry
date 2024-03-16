import { getCordServerToken } from "@/app/api/cord/getCordServerToken";
import { getUserInfo } from "@/app/api/user/[address]/info/getUserInfo";
import { UserSchema } from "@/db/schema/UserSchema";
import { database } from "@/utils/database/db";
import { inngest } from "@/utils/inngest/client";

export const updateCordUser = inngest.createFunction(
  { id: "update-cord-user" },
  {
    event: "user/updated",
  },
  async ({ event, step }) => {
    await step.run("Update Cord user", async () => {
      const user = await database
        .collection<UserSchema>("users")
        .findOne({ _id: event.data.address });

      if (!user) {
        throw new Error(`User with id ${event.data.address} not found`);
      }

      const cordToken = await getCordServerToken();

      const userInfo = await getUserInfo(user._id);
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
            profilePictureURL: userInfo.profilePic ?? null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update user`, await response.json());
      }
    });
  }
);
