import { PngDataUri } from "@/types/image";
import { ObjectId } from "mongodb";
import { TraitCategory } from "noggles";

export interface TraitSchema {
  _id: ObjectId;
  nft: PngDataUri;
  name: string;
  type: TraitCategory;
  trait: PngDataUri;
  address: `0x${string}`;
  likedBy: `0x${string}`[];
  creationDate: number;
}
``;
