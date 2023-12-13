import { ERC55Address } from "@/types/address";
import { PngDataUri } from "@/types/image";
import { ObjectId } from "mongodb";
import { TraitCategory } from "noggles";

export interface TraitSchema {
  _id: ObjectId;
  nft: PngDataUri;
  name: string;
  type: TraitCategory;
  trait: PngDataUri;
  address: ERC55Address;
  likedBy: `0x${string}`[];
  creationDate: number;
}
