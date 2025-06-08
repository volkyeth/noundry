import { TraitSchema } from "@/db/schema/TraitSchema";
import { database } from "@/utils/database/db";
import Session from "@/utils/siwe/session";
import JSZip from "jszip";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const cookieStore = cookies();
  const session = await Session.fromCookieStore(cookieStore);

  if (session.address !== "0x6a024f521f83906671e1a23a8b6c560be7e980f4") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const traitPreviews = await database
    .collection<TraitSchema>("nfts")
    .find({ removed: { $ne: true } }, { projection: { _id: 1, nft: 1 } })
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
