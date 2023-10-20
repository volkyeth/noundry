import { UserSchema } from "@/db/schema/UserSchema";
import { UserInfo } from "@/types/user";
import { database } from "@/utils/database/db";

export const getUserInfo = async (address: `0x${string}`) =>
  database
    .collection<UserSchema>("users")
    .findOne(
      { _id: address },
      {
        projection: {
          twitter: true,
          userName: true,
          about: true,
          profilePic: true,
        },
      }
    )
    .then(
      (user) =>
        ({
          address: user?._id,
          about: user?.about,
          profilePic: user?.profilePic,
          twitter: user?.twitter,
          userName: user?.userName,
        }) as UserInfo
    );
