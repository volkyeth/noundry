import { CORD_GROUP_ID } from "@/constants/cord";
import Session from "@/utils/siwe/session";
import { getClientAuthToken } from "@cord-sdk/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCordUserToken } from "./getCordUserToken";

export const GET = async (req: Request) => {
  const cookieStore = cookies();
  const session = await Session.fromCookieStore(cookieStore);

  if (
    !process.env.CORD_APPLICATION_ID ||
    !process.env.CORD_APPLICATION_SECRET
  ) {
    throw new Error("Missing CORD_APPLICATION_ID or CORD_APPLICATION_SECRET");
  }

  if (!session.address) {
    return NextResponse.json(
      getClientAuthToken(
        process.env.CORD_APPLICATION_ID,
        process.env.CORD_APPLICATION_SECRET,
        {
          user_id: "shared-anon",
          group_id: CORD_GROUP_ID,
          user_details: {
            name: "anon",
          },
        }
      )
    );
  }

  return NextResponse.json(await getCordUserToken(session.address));
};
