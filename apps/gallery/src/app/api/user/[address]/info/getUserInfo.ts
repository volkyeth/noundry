import { DEFAULT_PROFILE_PICTURE } from "@/constants/config";
import { UserSchema } from "@/db/schema/UserSchema";
import { UserInfo } from "@/types/user";
import { shortAddress } from "@/utils/address/format";
import { database } from "@/utils/database/db";
import { getAddress } from "viem";

export const getUserInfo = async (address: `0x${string}`): Promise<UserInfo> =>
  await database
    .collection<UserSchema>("users")
    .findOne({ _id: getAddress(address) })
    .then((user) =>
      user
        ? {
            address: user?._id,
            about: user?.about,
            profilePic:
              user?.profilePic || user?.ensAvatar || DEFAULT_PROFILE_PICTURE,
            twitter: user?.twitter,
            farcaster: user?.farcaster,
            userName:
              user?.userName?.toLowerCase() ||
              user?.ensName ||
              shortAddress(user._id),
          }
        : {
            address,
            userName: shortAddress(address),
            profilePic: DEFAULT_PROFILE_PICTURE,
          }
    );
