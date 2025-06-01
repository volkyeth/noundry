import { LowercaseAddress } from "@/types/address";
import { PngDataUri } from "@/types/image";
import { SubmissionCategory } from "@/types/submission";
import { ObjectId } from "mongodb";

export interface TraitSchema {
  _id: ObjectId;
  nft: PngDataUri;
  name: string;
  type: SubmissionCategory;
  trait: PngDataUri;
  address: LowercaseAddress;
  likedBy: LowercaseAddress[];
  creationDate: number;
  twitterPostId?: string;
  farcasterCastHash?: string;
  discordPostId?: string;
}
