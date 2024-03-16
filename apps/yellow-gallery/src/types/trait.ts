import { TraitCategory } from "noggles";
import { PngDataUri } from "./image";

export interface Trait {
  id: string;
  nft: PngDataUri;
  name: string;
  type: TraitCategory;
  trait: PngDataUri;
  address: `0x${string}`;
  background: string;
  body: string;
  head: string;
  accessory: string;
  glasses: string;
  likesCount: number;
  creationDate: number;
}
