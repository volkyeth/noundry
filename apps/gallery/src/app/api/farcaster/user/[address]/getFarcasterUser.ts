import { FarcasterUser } from "@/types/farcaster";

export const getFarcasterUser = async (
  address: `0x${string}`
): Promise<FarcasterUser | null> => {
  const response = await fetch(
    `https://api.warpcast.com/v2/user-by-verification?address=${address}`,
    {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${process.env.FARCASTER_AUTH_TOKEN}`,
      },
    }
  ).then((res) => res.json());

  if (!response.result) return null;

  const { fid, username, displayName, pfp, profile } = response.result.user;

  return {
    fid,
    username,
    displayName,
    bio: profile?.bio?.text,
    pfp: pfp?.url,
  };
};
