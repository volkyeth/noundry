import { TraitSchema } from "@/db/schema/TraitSchema";
import { database } from "@/utils/database/db";
import { inngest } from "@/utils/inngest/client";
import Session, { assertSiwe } from "@/utils/siwe/session";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getTrait } from "./getTrait";

export async function GET(req: NextRequest, { params: { id } }) {
  const session = await Session.fromRequest(req);
  return NextResponse.json(await getTrait(id, { requester: session.address }));
}

export async function DELETE(req: NextRequest, { params: { id } }) {
  const session = await Session.fromRequest(req);
  assertSiwe(session);

  const trait = await getTrait(id);

  if (!trait) return NextResponse.json({}, { status: 200 });

  if (trait?.address.toLowerCase() !== session.address?.toLowerCase())
    return NextResponse.json(
      { error: "Must be the trait creator" },
      { status: 403 }
    );

  const result = await database
    .collection<TraitSchema>("nfts")
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount !== 1)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });

  await inngest.send({
    name: "trait/deleted",
    data: { traitId: id },
  });

  return NextResponse.json({}, { status: 200 });
}
