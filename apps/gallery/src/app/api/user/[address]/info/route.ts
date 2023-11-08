import { addressSchema } from "@/schemas/common";
import { updateUserQuerySchema } from "@/schemas/updateUserQuery";
import { database } from "@/utils/database/db";
import Session from "@/utils/siwe/session";
import { NextRequest, NextResponse } from "next/server";
import { getUserInfo } from "./getUserInfo";

export const GET = async (req: NextRequest, { params }) => {
  const address = addressSchema.parse(params.address) as `0x${string}`;

  return NextResponse.json(await getUserInfo(address));
};

export const PUT = async (req: NextRequest, { params }) => {
  const session = await Session.assertSiwe(req);
  const address = addressSchema.parse(params.address) as `0x${string}`;

  if (session.address.toLowerCase() !== address.toLowerCase()) {
    return NextResponse.json({ error: "Must be signed in" }, { status: 403 });
  }

  const updateUserQuery = updateUserQuerySchema.safeParse(await req.json());
  if (!updateUserQuery.success) {
    return NextResponse.json(updateUserQuery.error.issues, { status: 400 });
  }

  const result = await database
    .collection("users")
    // @ts-expect-error
    .replaceOne({ _id: address }, updateUserQuery.data, {
      upsert: true,
    });

  if (!result.upsertedId) {
    return NextResponse.json(
      { error: "Failed updating user info" },
      { status: 500 }
    );
  }

  return NextResponse.json({}, { status: 200 });
};
