import { FarcasterUser } from "@/types/farcaster";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params: { address } }: { params: { address: string } }
) {
  // TODO cache for 15min
  const response = await fetch(
    `https://api.warpcast.com/v2/user-by-verification?address=${address}`,
    {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${process.env.FARCASTER_AUTH_TOKEN}`,
      },
    }
  ).then((res) => res.json());

  if (!response.result) return NextResponse.json({}, { status: 404 });

  const { fid, username, displayName, pfp, profile } = response.result.user;

  return NextResponse.json<FarcasterUser>({
    fid,
    username,
    displayName,
    bio: profile?.bio?.text,
    pfp: pfp?.url,
  });
}
