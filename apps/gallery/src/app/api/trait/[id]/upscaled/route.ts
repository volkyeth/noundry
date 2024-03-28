import { resizePng } from "@/utils/image/resize";
import Session from "@/utils/siwe/session";
import { NextRequest, NextResponse } from "next/server";
import { getTrait } from "../../../../actions/getTrait";

export async function GET(req: NextRequest, { params: { id } }) {
  const session = await Session.fromRequest(req);

  const trait = await getTrait(id, { requester: session.address });

  if (!trait) return NextResponse.json({}, { status: 404 });

  const upscaledImage = await resizePng(trait.nft, 320, 320);

  return NextResponse.json({ ...trait, nft: upscaledImage });
}
