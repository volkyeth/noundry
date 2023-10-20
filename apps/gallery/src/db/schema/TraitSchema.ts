import { ObjectId } from "mongodb";
import { TraitCategory } from "noggles";

export interface TraitSchema {
  _id: ObjectId;
  nft: string;
  name: string;
  type: TraitCategory;
  trait: string;
  address: `0x${string}`;
  likedBy: `0x${string}`[];
  creationDate: number;
}
``;
