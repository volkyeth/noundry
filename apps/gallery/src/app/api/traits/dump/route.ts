import { TraitSchema } from "@/db/schema/TraitSchema";
import { database } from "@/utils/database/db";
import Session from "@/utils/siwe/session";
import JSZip from "jszip";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await Session.assertSiwe(req);

  if (session.address !== "0x6a024f521f83906671e1a23a8B6c560be7e980F4") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const traitPreviews = await database
    .collection<TraitSchema>("nfts")
    .find({}, { projection: { _id: 1, nft: 1 } })
    .toArray();

  const zip = new JSZip();
  const folder = zip.folder("gallery");
  for (const trait of traitPreviews) {
    folder?.file(`${trait._id}.png`, trait.nft.split("base64,")[1], {
      base64: true,
    });
  }

  return new Response(await zip.generateAsync({ type: "blob" }), {
    headers: { "Content-Type": "application/zip" },
  });
};