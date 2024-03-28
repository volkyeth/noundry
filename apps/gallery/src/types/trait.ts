import { TraitCategory } from "noggles";
import { PngDataUri } from "./image";

export interface Trait {
  id: string;
  nft: PngDataUri;
  name: string;
  type: TraitCategory;
  trait: PngDataUri;
  address: `0x${string}`;
  likesCount: number;
  creationDate: number;
}
