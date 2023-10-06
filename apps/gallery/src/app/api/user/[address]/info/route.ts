import { UserSchema } from "@/db/schema/UserSchema";
import { database } from "@/utils/database/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params: { address } }) =>
  NextResponse.json(
    await database.collection<UserSchema>("users").findOne(
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
  );
