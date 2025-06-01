import { PngDataUri } from "./image";
import { SubmissionCategory } from "./submission";

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
}
