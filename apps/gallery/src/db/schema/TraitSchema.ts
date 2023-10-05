import { Base64EncodedPng } from "@/types/image";
import { TraitType } from "@/types/trait";
import { ObjectId } from "mongodb";

export interface TraitSchema {
  _id: ObjectId;
  nft: Base64EncodedPng;
  name: string;
  type: TraitType;
  trait: Base64EncodedPng;
  address: `0x${string}`;
  background: string;
  body: string;
  head: string;
  accessory: string;
  glasses: string;
  likedBy: `0x${string}`[];
  creationDate: number;
}
