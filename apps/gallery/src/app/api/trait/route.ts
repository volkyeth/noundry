import { castTraitOnFarcaster } from "@/app/actions/trait/castOnFarcaster";
import { postTraitOnDiscord } from "@/app/actions/trait/postOnDiscord";
import { postTraitOnTwitter } from "@/app/actions/trait/postOnTwitter";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { addTraitQuerySchema } from "@/schemas/addTraitQuery";
import { PngDataUri } from "@/types/image";
import { database } from "@/utils/database/db";
import Session, { assertSiwe } from "@/utils/siwe/session";
import { submissionCategory } from "@/utils/traits/categories";
import { waitUntil } from "@vercel/functions";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const session = await Session.fromCookieStore(cookieStore);
  assertSiwe(session);

  const addTraitQuery = addTraitQuerySchema.safeParse(await req.json());

  if (!addTraitQuery.success) {
    return NextResponse.json(addTraitQuery.error.issues, { status: 400 });
  }

  const { 
    previewImage, 
    name, 
    traitImage, 
    traitType,
    seed
  } = addTraitQuery.data;

  const id = new ObjectId();

  await database.collection<TraitSchema>("nfts").insertOne({
    _id: id,
    nft: previewImage as PngDataUri,
    name: name,
    type: submissionCategory(traitType),
    trait: traitImage as PngDataUri,
    address: session.address!,
    likedBy: [],
    creationDate: Date.now(),
    seed,
  });

  // Create the response
  const response = NextResponse.json({ id: id.toString() });

  if (process.env.NOUNDRY_SUBMISSIONS_DISCORD_CHANNEL_ID) waitUntil(postTraitOnDiscord(id.toString()))
  if (process.env.NOUNDRY_TWITTER_ACCESS_TOKEN) waitUntil(postTraitOnTwitter(id.toString()))
  if (process.env.NOUNDRY_NEYNAR_SIGNER_UUID) waitUntil(castTraitOnFarcaster(id.toString()))

  return response;
}
