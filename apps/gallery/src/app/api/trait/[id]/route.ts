import { deleteTraitFromFarcaster } from "@/app/actions/trait/castOnFarcaster";
import { deleteTraitFromDiscord } from "@/app/actions/trait/postOnDiscord";
import { deleteTraitFromTwitter } from "@/app/actions/trait/postOnTwitter";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { getDatabase } from "@/utils/database/db";
import Session, { assertSiwe } from "@/utils/siwe/session";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getTrait } from "../../../actions/getTrait";

export async function GET(req: NextRequest, { params: { id } }) {
  const session = await Session.fromRequest(req);
  return NextResponse.json(await getTrait(id, { requester: session.address }));
}

export async function DELETE(req: NextRequest, { params: { id: traitId } }) {
  const session = await Session.fromRequest(req);
  assertSiwe(session);

  const trait = await getTrait(traitId);

  if (!trait) return NextResponse.json({}, { status: 200 });

  if (trait?.address.toLowerCase() !== session.address?.toLowerCase())
    return NextResponse.json(
      { error: "Must be the trait creator" },
      { status: 403 }
    );

  // Delete Twitter post if it exists
  if (trait.twitterPostId && process.env.NOUNDRY_TWITTER_ACCESS_TOKEN) {
    try {
      await deleteTraitFromTwitter(trait.twitterPostId);
      console.log(`Deleted Twitter post for trait ${traitId}`);
    } catch (error) {
      console.error(`Error deleting Twitter post for trait ${traitId}:`, error);
    }
  }

  // Delete Farcaster post if it exists
  if (trait.farcasterCastHash && process.env.NOUNDRY_NEYNAR_SIGNER_UUID) {
    try {
      await deleteTraitFromFarcaster(trait.farcasterCastHash);
      console.log(`Deleted Farcaster post for trait ${traitId}`);
    } catch (error) {
      console.error(`Error deleting Farcaster post for trait ${traitId}:`, error);
    }
  }

  // Delete Discord post if it exists
  if (trait.discordPostId && process.env.NOUNDRY_SUBMISSIONS_DISCORD_CHANNEL_ID) {
    try {
      const channelId = process.env.NOUNDRY_SUBMISSIONS_DISCORD_CHANNEL_ID;

      if (channelId) {
        await deleteTraitFromDiscord(trait.discordPostId, channelId);
        console.log(`Deleted Discord post for trait ${traitId}`);
      } else {
        console.warn(`No Discord channel ID found for trait ${traitId}`);
      }
    } catch (error) {
      console.error(`Error deleting Discord post for trait ${traitId}:`, error);
    }
  }

  const database = await getDatabase();
  const result = await database
    .collection<TraitSchema>("nfts")
    .updateOne(
      { _id: new ObjectId(traitId) },
      { $set: { removed: true } }
    );

  if (result.modifiedCount !== 1)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });

  return NextResponse.json({}, { status: 200 });
}
