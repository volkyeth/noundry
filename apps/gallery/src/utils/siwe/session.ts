import {
  SIWE_COOKIE_NAME,
  SIWE_SESSION_SECRET,
  SIWE_TTL,
} from "@/utils/siwe/constants";
import { sealData, unsealData } from "iron-session";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest, NextResponse } from "next/server";

const SESSION_OPTIONS = {
  ttl: SIWE_TTL,
  password: SIWE_SESSION_SECRET,
};

export type ISession = {
  nonce?: string;
  chainId?: number;
  address?: string;
};

class Session {
  nonce?: string;
  chainId?: number;
  address?: `0x${string}`;

  constructor(session?: ISession) {
    this.nonce = session?.nonce;
    this.chainId = session?.chainId;
    this.address = session?.address as `0x${string}`;
  }

  static async fromRequest(req: NextRequest): Promise<Session> {
    const sessionCookie = req.cookies.get(SIWE_COOKIE_NAME)?.value;

    if (!sessionCookie) return new Session();
    return new Session(
      await unsealData<ISession>(sessionCookie, SESSION_OPTIONS)
    );
  }

  static async assertSiwe(req: NextRequest): Promise<void> {
    const session = await this.fromRequest(req);

    if (!session.address || session.chainId !== 1 || !session.nonce)
      throw new Error("Missing SIWE session");
  }

  clear(res: NextResponse): Promise<void> {
    this.nonce = undefined;
    this.chainId = undefined;
    this.address = undefined;

    return this.persist(res);
  }

  toJSON(): ISession {
    return { nonce: this.nonce, address: this.address, chainId: this.chainId };
  }

  async persist(res: NextResponse): Promise<void> {
    res.cookies.set(
      SIWE_COOKIE_NAME,
      await sealData(this.toJSON(), SESSION_OPTIONS),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      }
    );
  }
}

export default Session;
