import { CORD_GROUP_ID } from "@/constants/cord";
import { getClientAuthToken } from "@cord-sdk/server";
import { getAddress } from "viem";

export const getCordUserToken = async (address: `0x${string}`) => {
  if (
    !process.env.CORD_APPLICATION_ID ||
    !process.env.CORD_APPLICATION_SECRET
  ) {
    throw new Error("Missing CORD_APPLICATION_ID or CORD_APPLICATION_SECRET");
  }

  return getClientAuthToken(
    process.env.CORD_APPLICATION_ID,
    process.env.CORD_APPLICATION_SECRET,
    {
      user_id: getAddress(address),
      group_id: CORD_GROUP_ID,
    }
  );
};
