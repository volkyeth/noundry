import Session from "@/utils/siwe/session";
import { NextRequest, NextResponse } from "next/server";
import { getTrait } from "./getTrait";

export async function GET(req: NextRequest, { params: { id } }) {
  const session = await Session.fromRequest(req);
  return NextResponse.json(await getTrait(id, session.address));
}
