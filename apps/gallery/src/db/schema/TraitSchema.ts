import { TraitType } from "@/types/trait";
import { ObjectId } from "mongodb";

export interface TraitSchema {
  _id: ObjectId;
  nft: string;
  name: string;
  type: TraitType;
  trait: string;
  address: `0x${string}`;
  background: string;
  body: string;
  head: string;
  accessory: string;
  glasses: string;
  likedBy: `0x${string}`[];
  creationDate: number;
}
