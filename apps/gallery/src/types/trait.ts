import { PngDataUri } from "./image";
import { SubmissionCategory } from "./submission";
import { UserInfo } from "./user";

export interface Trait {
  id: string;
  nft: PngDataUri;
  name: string;
  type: Exclude<SubmissionCategory, "backgrounds">;
  trait: PngDataUri;
  address: `0x${string}`;
  likesCount: number;
  creationDate: number;
  twitterPostId?: string;
  farcasterCastHash?: string;
  discordPostId?: string;
  remixedFrom?: string;
  version: number;
  // Optional seed object containing all trait values (for old traits that don't have this info)
  seed?: {
    accessory?: number;
    background?: number;
    body?: number;
    glasses?: number;
    head?: number;
  };
  // User info for the trait creator
  userInfo?: UserInfo;
}
