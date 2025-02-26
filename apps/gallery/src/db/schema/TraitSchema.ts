import { LowercaseAddress } from "@/types/address";
import { PngDataUri } from "@/types/image";
import { ObjectId } from "mongodb";
import { TraitCategory } from "noggles";

export interface TraitSchema {
  _id: ObjectId;
  nft: PngDataUri;
  name: string;
  type: TraitCategory;
  trait: PngDataUri;
  address: LowercaseAddress;
  likedBy: LowercaseAddress[];
  creationDate: number;
  twitterPostId?: string;
  farcasterCastHash?: string;
  discordPostId?: string;
}
