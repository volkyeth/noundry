import { TraitSchema } from "@/db/schema/TraitSchema";
import { addTraitQuerySchema } from "@/schemas/addTraitQuery";
import { database } from "@/utils/database/db";
import Session, { assertSiwe } from "@/utils/siwe/session";
import { traitCategory } from "@/utils/traits/categories";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { TraitType } from "noggles";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const session = await Session.fromCookieStore(cookieStore);
  assertSiwe(session);

  const addTraitQuery = addTraitQuerySchema.safeParse(await req.json());

  if (!addTraitQuery.success) {
    return NextResponse.json(addTraitQuery.error.issues, { status: 400 });
  }

  const { previewImage, name, traitImage, traitType } = addTraitQuery.data;

  const id = new ObjectId();

  await database.collection<TraitSchema>("nfts").insertOne({
    _id: id,
    nft: previewImage,
    name: name,
    type: traitCategory(traitType as TraitType),
    trait: traitImage,
    address: session.address as `0x${string}`,
    likedBy: [],
    creationDate: Date.now(),
  });

  return NextResponse.json({ id: id.toString() });
}
