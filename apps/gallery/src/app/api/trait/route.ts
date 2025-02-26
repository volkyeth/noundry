import { castTraitOnFarcaster } from "@/app/actions/trait/castOnFarcaster";
import { postTraitOnDiscord } from "@/app/actions/trait/postOnDiscord";
import { postTraitOnTwitter } from "@/app/actions/trait/postOnTwitter";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { addTraitQuerySchema } from "@/schemas/addTraitQuery";
import { PngDataUri } from "@/types/image";
import { database } from "@/utils/database/db";
import Session, { assertSiwe } from "@/utils/siwe/session";
import { traitCategory } from "@/utils/traits/categories";
import { waitUntil } from "@vercel/functions";
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
    nft: previewImage as PngDataUri,
    name: name,
    type: traitCategory(traitType as TraitType),
    trait: traitImage as PngDataUri,
    address: session.address!,
    likedBy: [],
    creationDate: Date.now(),
  });

  // Create the response
  const response = NextResponse.json({ id: id.toString() });

  waitUntil(postTraitOnDiscord(id.toString()))
  waitUntil(postTraitOnTwitter(id.toString()))
  waitUntil(castTraitOnFarcaster(id.toString()))

  return response;
}
